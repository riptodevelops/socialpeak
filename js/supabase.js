// Socialpeak.store - Supabase Integration Module
// Handles Realtime Data Sync, Auth with Email Verification Link, Products & Orders

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let supabaseClient = null;
let initPromise = null;

// Resolve Supabase Credentials from various environments
export function getSupabaseCredentials() {
  if (typeof window === "undefined") {
    return {
      url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
      anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""
    };
  }

  // 1. window.__ENV__ or direct window properties (injected in head or build)
  const windowEnv = window.__ENV__ || {};
  let url = windowEnv.VITE_SUPABASE_URL || windowEnv.SUPABASE_URL || window.VITE_SUPABASE_URL || window.SUPABASE_URL || "";
  let anonKey = windowEnv.VITE_SUPABASE_ANON_KEY || windowEnv.SUPABASE_ANON_KEY || window.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || "";

  // 2. localStorage override (can be set by admin or tests)
  if (!url) {
    try {
      url = localStorage.getItem("socialpeak_supabase_url") || "";
    } catch (e) {}
  }
  if (!anonKey) {
    try {
      anonKey = localStorage.getItem("socialpeak_supabase_anon_key") || "";
    } catch (e) {}
  }

  return { url: (url || "").trim(), anonKey: (anonKey || "").trim() };
}

// Initialize Supabase Client
export function initSupabase(customUrl, customKey) {
  let { url, anonKey } = getSupabaseCredentials();
  if (customUrl) url = customUrl.trim();
  if (customKey) anonKey = customKey.trim();

  if (!url || !anonKey) {
    return null;
  }

  try {
    supabaseClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined
      }
    });
    return supabaseClient;
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
    return null;
  }
}

// Asynchronously ensure Supabase is initialized (fetches /api/config if not configured in window)
export async function ensureSupabase() {
  if (supabaseClient) return supabaseClient;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    let creds = getSupabaseCredentials();
    if (!creds.url || !creds.anonKey) {
      if (typeof fetch !== "undefined") {
        try {
          const res = await fetch("/api/config");
          if (res.ok) {
            const data = await res.json();
            if (data.supabaseUrl && data.supabaseAnonKey) {
              if (typeof window !== "undefined") {
                window.VITE_SUPABASE_URL = data.supabaseUrl;
                window.VITE_SUPABASE_ANON_KEY = data.supabaseAnonKey;
              }
              initSupabase(data.supabaseUrl, data.supabaseAnonKey);
            }
          }
        } catch (e) {
          // ignore network failure to /api/config
        }
      }
    } else {
      initSupabase(creds.url, creds.anonKey);
    }
    return supabaseClient;
  })();

  return initPromise;
}

// Get the current Supabase client instance (or initialize synchronously if credentials exist)
export function getSupabase() {
  if (!supabaseClient) {
    initSupabase();
  }
  return supabaseClient;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabase());
}

/* ================= AUTHENTICATION & EMAIL VERIFICATION ================= */

/**
 * Register user and send Supabase confirmation email verification link
 */
export async function supabaseSignUp({ email, password, name, phone }) {
  const client = await ensureSupabase();
  if (!client) {
    return { success: false, error: "Database not configured yet. Please configure Supabase credentials in Vercel settings." };
  }

  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();
  const cleanName = (name || "").trim() || cleanEmail.split("@")[0];
  const cleanPhone = (phone || "").trim();

  try {
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/account` : undefined;
    const { data, error } = await client.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          name: cleanName,
          phone: cleanPhone,
          role: cleanEmail === "socialpeak@gmail.com" ? "admin" : "user"
        },
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Check if email confirmation is required (session is null or identities unconfirmed)
    const needsEmailConfirmation = !data.session;

    return {
      success: true,
      user: {
        id: data.user.id,
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        isAdmin: cleanEmail === "socialpeak@gmail.com" || data.user.user_metadata?.role === "admin"
      },
      needsEmailConfirmation,
      message: needsEmailConfirmation
        ? "Verification email sent! Please check your inbox and click the verification link to activate your account."
        : "Account created successfully!"
    };
  } catch (err) {
    return { success: false, error: err.message || "Failed to sign up" };
  }
}

/**
 * Sign in user with email & password. Verifies email confirmation.
 */
export async function supabaseSignIn({ email, password }) {
  const client = await ensureSupabase();
  if (!client) {
    // If Supabase not yet configured, allow admin direct fallback
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();
    if (cleanEmail === "socialpeak@gmail.com" && cleanPassword === "SocialPeak") {
      return {
        success: true,
        user: {
          name: "Store Admin",
          email: "socialpeak@gmail.com",
          phone: "+91 92508 06417",
          isAdmin: true,
          joinedAt: "Administrator"
        }
      };
    }
    return { success: false, error: "Database not configured yet. Please configure Supabase credentials in Vercel settings." };
  }

  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success: false,
          needsEmailConfirmation: true,
          error: "Your email is not verified yet. Please click the verification link sent to your email inbox."
        };
      }
      return { success: false, error: error.message };
    }

    const sbUser = data.user;
    const isAdmin = cleanEmail === "socialpeak@gmail.com" || sbUser.user_metadata?.role === "admin";

    const userObj = {
      id: sbUser.id,
      name: sbUser.user_metadata?.name || (cleanEmail.split("@")[0]),
      email: cleanEmail,
      phone: sbUser.user_metadata?.phone || "",
      isAdmin: isAdmin,
      joinedAt: new Date(sbUser.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    };

    return { success: true, user: userObj, session: data.session };
  } catch (err) {
    return { success: false, error: err.message || "Failed to sign in" };
  }
}

/**
 * Resend verification email
 */
export async function supabaseResendVerification(email) {
  const client = await ensureSupabase();
  if (!client) return { success: false, error: "Database not configured" };

  try {
    const { error } = await client.auth.resend({
      type: "signup",
      email: (email || "").trim().toLowerCase(),
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, message: "Verification email resent! Please check your inbox." };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sign out
 */
export async function supabaseSignOut() {
  const client = await ensureSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {}
  }
}

/**
 * Get current session user
 */
export async function supabaseGetUser() {
  const client = await ensureSupabase();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    if (!data || !data.user) return null;
    const u = data.user;
    const cleanEmail = (u.email || "").toLowerCase();
    return {
      id: u.id,
      name: u.user_metadata?.name || cleanEmail.split("@")[0],
      email: cleanEmail,
      phone: u.user_metadata?.phone || "",
      isAdmin: cleanEmail === "socialpeak@gmail.com" || u.user_metadata?.role === "admin"
    };
  } catch (e) {
    return null;
  }
}

/* ================= PRODUCTS SUPABASE STORE ================= */

export async function supabaseGetProducts() {
  const client = await ensureSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Supabase fetch products error:", error.message);
      return null;
    }

    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline || "",
      price: Number(p.price),
      originalPrice: (p.original_price !== null && p.original_price !== undefined) ? Number(p.original_price) : null,
      category: p.category,
      image: p.image || "",
      description: p.description || ""
    }));
  } catch (err) {
    console.warn("Error getting products from Supabase:", err);
    return null;
  }
}

export async function supabaseUpsertProduct(product) {
  const client = await ensureSupabase();
  if (!client) return null;

  try {
    const row = {
      id: product.id,
      name: product.name,
      tagline: product.tagline || "",
      price: Number(product.price),
      original_price: (product.originalPrice !== null && product.originalPrice !== undefined && !isNaN(Number(product.originalPrice))) ? Number(product.originalPrice) : null,
      category: product.category || "entertainment",
      image: product.image || "",
      description: product.description || ""
    };

    const { data, error } = await client
      .from("products")
      .upsert(row, { onConflict: "id" })
      .select();

    if (error) {
      console.error("Supabase upsert product error:", error.message);
      return null;
    }
    return data?.[0] || row;
  } catch (err) {
    console.error("Error upserting product to Supabase:", err);
    return null;
  }
}

export async function supabaseDeleteProduct(productId) {
  const client = await ensureSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Supabase delete product error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting product from Supabase:", err);
    return false;
  }
}

/* ================= ORDERS SUPABASE STORE ================= */

export async function supabaseGetOrders() {
  const client = await ensureSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch orders error:", error.message);
      return null;
    }

    return (data || []).map(o => ({
      id: o.id,
      customerName: o.customer_name,
      email: o.email,
      phone: o.phone || "",
      items: o.items || [],
      total: Number(o.total),
      utr: o.utr || "",
      notes: o.notes || "",
      status: o.status || "Pending",
      createdAt: o.created_at
    }));
  } catch (err) {
    console.warn("Error getting orders from Supabase:", err);
    return null;
  }
}

export async function supabaseCreateOrder(order) {
  const client = await ensureSupabase();
  if (!client) return null;

  try {
    const row = {
      id: order.id,
      customer_name: order.customerName,
      email: order.email,
      phone: order.phone || "",
      items: order.items || [],
      total: Number(order.total),
      utr: order.utr || "",
      notes: order.notes || "",
      status: order.status || "Pending"
    };

    const { data, error } = await client
      .from("orders")
      .insert(row)
      .select();

    if (error) {
      console.error("Supabase create order error:", error.message);
      return null;
    }
    return data?.[0] || row;
  } catch (err) {
    console.error("Error creating order in Supabase:", err);
    return null;
  }
}

export async function supabaseUpdateOrderStatus(orderId, newStatus) {
  const client = await ensureSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Supabase update order status error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error updating order status in Supabase:", err);
    return false;
  }
}

// Automatically initiate config fetch on module load in browser
if (typeof window !== "undefined") {
  ensureSupabase();
}
