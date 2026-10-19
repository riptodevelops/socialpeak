// Socialpeak Central Store & State Management
// Integrated with Supabase (Products, Orders, Auth with Email Verification) & LocalStorage Cache

import {
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignOut,
  supabaseGetUser,
  supabaseGetProducts,
  supabaseUpsertProduct,
  supabaseDeleteProduct,
  supabaseGetOrders,
  supabaseCreateOrder,
  supabaseUpdateOrderStatus,
  ensureSupabase
} from './supabase.js';

const CART_KEY = 'socialpeak_cart';
const USER_KEY = 'socialpeak_user';
const USERS_LIST_KEY = 'socialpeak_users_list';
const ORDERS_KEY = 'socialpeak_orders';
const PRODUCTS_KEY = 'socialpeak_products';
const ADMIN_AUTH_KEY = 'socialpeak_admin_auth';
const MIGRATION_KEY = 'socialpeak_clean_supabase_v2';

// Clean slate: all default dummy mock data cleared
const DEFAULT_ORDERS = [];
const DEFAULT_PRODUCTS = [];

// Clean old mock data on first visit
if (typeof window !== 'undefined') {
  try {
    if (!localStorage.getItem(MIGRATION_KEY)) {
      // Clear legacy dummy test data
      localStorage.removeItem(ORDERS_KEY);
      localStorage.removeItem(PRODUCTS_KEY);
      localStorage.removeItem(USERS_LIST_KEY);
      const cur = localStorage.getItem(USER_KEY);
      if (cur && (cur.includes('customer@example.com') || cur.includes('aman.sharma'))) {
        localStorage.removeItem(USER_KEY);
      }
      localStorage.setItem(MIGRATION_KEY, 'true');
    }
  } catch (e) {}
}

export function getProductImage(product) {
  if (product && product.image) return product.image;
  const key = ((product && (product.id || product.name)) || '').toLowerCase();
  if (key.includes('netflix')) return '/images/netflix.svg';
  if (key.includes('youtube')) return '/images/youtube.svg';
  if (key.includes('spotify')) return '/images/spotify.svg';
  if (key.includes('apple')) return '/images/applemusic.svg';
  if (key.includes('adobe')) return '/images/adobe.svg';
  if (key.includes('gemini')) return '/images/googlegemini.svg';
  if (key.includes('hotstar')) return '/images/product-hotstar-sCpbmH6z.jpg';
  if (key.includes('canva')) return '/images/canva.svg';
  if (key.includes('chatgpt') || key.includes('openai')) return '/images/openai.svg';
  if (key.includes('duolingo')) return '/images/duolingo.svg';
  if (key.includes('linkedin')) return '/images/linkedin.svg';
  if (key.includes('amazon')) return '/images/amazon.svg';
  if (key.includes('crunchyroll')) return '/images/crunchyroll.svg';
  if (key.includes('whatsapp') || key.includes('otp')) return '/images/whatsapp.svg';
  if (key.includes('flipkart')) return '/images/flipkart.svg';
  if (key.includes('airtel')) return '/images/airtel.svg';
  if (key.includes('debit') || key.includes('card')) return '/images/product-card-BZPQiY7y.jpg';
  if (key.includes('account')) return '/images/product-account-OP5NNtlw.jpg';
  if (key.includes('kiro')) return '/images/product-kiro-CH2BEzpn.jpg';
  return '/images/product-other-DgUge5Fh.jpg';
}

/* ================= CART STORE ================= */

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart:', e);
    return [];
  }
}

export function saveCart(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('socialpeak_cart_updated', { detail: items }));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

export function addToCart(product, quantity = 1) {
  const current = getCart();
  const existingIdx = current.findIndex(item => item.name === product.name);
  if (existingIdx > -1) {
    current[existingIdx].quantity += quantity;
    if (product.image && !current[existingIdx].image) {
      current[existingIdx].image = product.image;
    }
  } else {
    current.push({
      id: product.id || product.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: product.name,
      price: (product.price !== undefined && !isNaN(Number(product.price))) ? Number(product.price) : 19,
      quantity: quantity,
      tagline: product.tagline || '',
      image: product.image || getProductImage(product)
    });
  }
  saveCart(current);
  showCartToast(product.name);
}

export function updateCartQuantity(name, delta) {
  let current = getCart();
  current = current.map(item => {
    if (item.name === name) {
      return { ...item, quantity: item.quantity + delta };
    }
    return item;
  }).filter(item => item.quantity > 0);
  saveCart(current);
}

export function removeFromCart(name) {
  const current = getCart().filter(item => item.name !== name);
  saveCart(current);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  const items = getCart();
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

export function getCartTotal() {
  const items = getCart();
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

/* ================= CART TOAST NOTIFICATION ================= */

export function showCartToast(productName) {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('sp-cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'sp-cart-toast';
  toast.className = 'sp-toast-enter';
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: #191c13;
      color: #f7f6ee;
      padding: 0.5rem 0.85rem;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(74,93,35,0.45);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      max-width: 90vw;
      font-size: 0.78rem;
      font-family: inherit;
      animation: toastSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
    ">
      <span style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: #4a5d23; color: #fff; font-size: 11px; font-weight: bold;">✓</span>
      <span style="font-weight: 500; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${escapeHtml(productName)}</span>
      <a href="/cart" style="
        background: #4a5d23;
        color: #ffffff;
        font-weight: 600;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
        font-size: 0.72rem;
        white-space: nowrap;
        transition: opacity 0.15s;
      " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
        Go to cart →
      </a>
      <button style="background: none; border: none; color: #a1a1aa; cursor: pointer; padding: 0 2px; font-size: 14px; line-height: 1;" onclick="document.getElementById('sp-cart-toast')?.remove()">✕</button>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -15px)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 2500);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

/* ================= USER AUTH STORE ================= */

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || !u.email) return null;
    return u;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new CustomEvent('socialpeak_auth_changed', { detail: user }));
}

export function getAllUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // Admin credentials verification (both local fallback & Supabase)
  if (
    (cleanEmail === 'socialpeak@gmail.com' || cleanEmail === 'socialpeak' || cleanEmail === 'admin@gmail.com' || cleanEmail === 'admin') &&
    (cleanPassword === 'SocialPeak' || cleanPassword === 'admin')
  ) {
    const adminUser = {
      name: 'Store Admin',
      email: 'socialpeak@gmail.com',
      phone: '+91 92508 06417',
      isAdmin: true,
      joinedAt: 'Administrator'
    };
    setCurrentUser(adminUser);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    }
    // Background Supabase sign-in
    supabaseSignIn({ email: 'socialpeak@gmail.com', password: 'SocialPeak' }).catch(() => {});
    return { success: true, user: adminUser };
  }

  // Attempt Supabase Auth login
  const sbRes = await supabaseSignIn({ email: cleanEmail, password: cleanPassword });
  if (sbRes.success && sbRes.user) {
    setCurrentUser(sbRes.user);
    return { success: true, user: sbRes.user };
  }

  // Check if unconfirmed email error
  if (sbRes.needsEmailConfirmation) {
    return {
      success: false,
      needsEmailConfirmation: true,
      error: 'Your email is not verified yet. Please click the confirmation link sent to your email inbox.'
    };
  }

  // Fallback to local accounts list
  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (found) {
    if (found.password && found.password !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setCurrentUser(found);
    return { success: true, user: found };
  }

  return { success: false, error: sbRes.error || 'Account does not exist. Please register first.' };
}

export async function registerUser({ name, email, phone, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanName = (name || '').trim() || cleanEmail.split('@')[0];
  const cleanPhone = (phone || '').trim();

  // Call Supabase signUp with email verification link flow
  const sbRes = await supabaseSignUp({
    email: cleanEmail,
    password: cleanPassword,
    name: cleanName,
    phone: cleanPhone
  });

  if (sbRes.success) {
    if (sbRes.needsEmailConfirmation) {
      return {
        success: true,
        needsEmailConfirmation: true,
        message: 'Verification link sent! Please check your inbox and verify your email before signing in.'
      };
    }
    if (sbRes.user) {
      setCurrentUser(sbRes.user);
      return { success: true, user: sbRes.user };
    }
  }

  // If Supabase returned error
  if (sbRes.error && sbRes.error.toLowerCase().includes('already registered')) {
    return { success: false, error: 'Account already exists with this email. Please sign in.' };
  }

  // Local fallback if Supabase is offline
  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'Account already exists with this email. Please sign in.' };
  }

  const newUser = {
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password: cleanPassword,
    joinedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  };
  users.push(newUser);
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  } catch (e) {}
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function logoutUser() {
  setCurrentUser(null);
  supabaseSignOut().catch(() => {});
}

/* ================= ORDERS STORE ================= */

export function getOrders() {
  if (typeof window === 'undefined') return DEFAULT_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ORDERS;
  } catch (e) {
    return DEFAULT_ORDERS;
  }
}

export function saveOrders(orders) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('socialpeak_orders_updated', { detail: orders }));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

export function createOrder({ customerName, email, phone, items, total, utr, notes = '' }) {
  const orders = getOrders();
  const newOrder = {
    id: 'SP-' + Math.floor(100000 + Math.random() * 900000),
    customerName: customerName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    items: items && items.length ? items : [{ name: 'Custom Activation', price: total, quantity: 1 }],
    total: Number(total),
    utr: utr.trim(),
    notes: notes.trim(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  saveOrders(orders);

  // Sync to Supabase in background
  supabaseCreateOrder(newOrder).catch(err => {
    console.warn('Could not sync order to Supabase:', err);
  });

  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    orders[idx].status = newStatus;
    saveOrders(orders);

    // Sync to Supabase in background
    supabaseUpdateOrderStatus(orderId, newStatus).catch(err => {
      console.warn('Could not update order status in Supabase:', err);
    });

    return true;
  }
  return false;
}

export function getUserOrders(userEmail) {
  if (!userEmail) return [];
  const orders = getOrders();
  return orders.filter(o => o.email.toLowerCase() === userEmail.toLowerCase());
}

/* ================= DYNAMIC PRODUCTS STORE ================= */

export function getProducts() {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PRODUCTS;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('socialpeak_products_updated', { detail: products }));
  } catch (e) {
    console.error('Error saving products:', e);
  }
}

export function addProduct({ name, price, originalPrice = null, category = 'entertainment', tagline = '', description = '', image = '' }) {
  const products = getProducts();
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const finalImage = (image && image.trim()) ? image.trim() : getProductImage({ id, name });
  const validOrigPrice = (originalPrice !== undefined && originalPrice !== null && !isNaN(Number(originalPrice)) && Number(originalPrice) > 0) ? Number(originalPrice) : null;
  const newProduct = {
    id: id,
    name: name.trim(),
    price: Number(price),
    originalPrice: validOrigPrice,
    category: category.toLowerCase(),
    tagline: tagline.trim() || `Instant activation — ₹${price}`,
    description: (description || '').trim(),
    image: finalImage
  };

  products.unshift(newProduct);
  saveProducts(products);

  // Sync to Supabase in background
  supabaseUpsertProduct(newProduct).catch(err => {
    console.warn('Could not sync product to Supabase:', err);
  });

  return newProduct;
}

export function updateProduct(id, updatedFields) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx > -1) {
    const fields = { ...updatedFields };
    if (fields.image !== undefined && !fields.image.trim()) {
      fields.image = getProductImage({ id, name: fields.name || products[idx].name });
    }
    if (fields.description !== undefined) {
      fields.description = (fields.description || '').trim();
    }
    if (fields.price !== undefined) {
      fields.price = Number(fields.price);
    }
    if (fields.originalPrice !== undefined) {
      fields.originalPrice = (fields.originalPrice !== null && fields.originalPrice !== '' && !isNaN(Number(fields.originalPrice)) && Number(fields.originalPrice) > 0)
        ? Number(fields.originalPrice)
        : null;
    }
    delete fields.emoji;
    delete products[idx].emoji;
    products[idx] = { ...products[idx], ...fields };
    saveProducts(products);

    // Sync to Supabase in background
    supabaseUpsertProduct(products[idx]).catch(err => {
      console.warn('Could not update product in Supabase:', err);
    });

    return true;
  }
  return false;
}

export function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);

  // Delete from Supabase in background
  supabaseDeleteProduct(id).catch(err => {
    console.warn('Could not delete product from Supabase:', err);
  });
}

/* ================= ADMIN AUTH ================= */

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true') return true;
  try {
    const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if (u && (u.isAdmin === true || (u.email && u.email.toLowerCase() === 'socialpeak@gmail.com') || (u.email && u.email.toLowerCase() === 'admin@gmail.com'))) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
  } catch (e) {}
  return false;
}

export function loginAdmin(user, pass) {
  const u = (user || '').trim().toLowerCase();
  const p = (pass || '').trim();
  if (
    (u === 'socialpeak@gmail.com' || u === 'socialpeak' || u === 'admin@gmail.com' || u === 'admin') &&
    (p === 'SocialPeak' || p === 'admin')
  ) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    }
    // Attempt Supabase sign in
    supabaseSignIn({ email: 'socialpeak@gmail.com', password: 'SocialPeak' }).catch(() => {});
    return true;
  }
  return false;
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    try {
      const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (u && (u.isAdmin || (u.email && u.email.toLowerCase() === 'socialpeak@gmail.com'))) {
        localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new CustomEvent('socialpeak_auth_changed', { detail: null }));
      }
    } catch (e) {}
  }
}

/* ================= SUPABASE BACKGROUND SYNC ================= */

export async function syncWithSupabase() {
  if (typeof window === 'undefined') return;

  try {
    await ensureSupabase();

    // 1. Sync Products from Supabase
    const remoteProducts = await supabaseGetProducts();
    if (remoteProducts !== null) {
      saveProducts(remoteProducts);
    }

    // 2. Sync Orders from Supabase
    const remoteOrders = await supabaseGetOrders();
    if (remoteOrders !== null) {
      saveOrders(remoteOrders);
    }

    // 3. Sync Active User session from Supabase
    const remoteUser = await supabaseGetUser();
    if (remoteUser) {
      setCurrentUser(remoteUser);
    }
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }
}

// Automatically sync when browser is idle or loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    syncWithSupabase();
  } else {
    window.addEventListener('load', () => syncWithSupabase());
  }
}
