import { l as getReact, s as getReactCore, o as getJsx } from "./useSelector-C0pj3Bsi.js";
import { r as Link } from "./client-DPgd7H-W.js";
import { a as ZapIcon, c as createIcon, n as Button, t as SiteChrome } from "./SiteChrome-BCifFRZP.js";
import { t as MessageCircleIcon } from "./message-circle-DujXu9uS.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  getOrders,
  getUserOrders,
  addToCart
} from "./store.js";
import { component as AdminPage } from "./admin-DzkdhcEh.js";

const React = getReact(getReactCore());
const { jsx, jsxs } = getJsx();

const UserIcon = createIcon("user", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "u1" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "u2" }]
]);

const CheckCircleIcon = createIcon("check-circle-2", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "cc1" }],
  ["path", { d: "m9 12 2 2 4-4", key: "cc2" }]
]);

const ClockIcon = createIcon("clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "cl1" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "cl2" }]
]);

const PackageIcon = createIcon("package", [
  ["path", { d: "M16.5 9.4 7.55 4.24", key: "p1" }],
  ["path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", key: "p2" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "p3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "p4" }]
]);

const GiftIcon = createIcon("gift", [
  ["polyline", { points: "20 12 20 22 4 22 4 12", key: "g1" }],
  ["rect", { width: "20", height: "5", x: "2", y: "7", key: "g2" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "7", key: "g3" }],
  ["path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z", key: "g4" }],
  ["path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z", key: "g5" }]
]);

const LogOutIcon = createIcon("log-out", [
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "lo1" }],
  ["polyline", { points: "16 17 21 12 16 7", key: "lo2" }],
  ["line", { x1: "21", x2: "9", y1: "12", y2: "12", key: "lo3" }]
]);

function AccountPage() {
  const [currentUser, setCurrentUser] = React.useState(() => getCurrentUser());
  const [orderTab, setOrderTab] = React.useState("active"); // "active" | "pending"
  
  // Auth Form State (for when not logged in)
  const [authMode, setAuthMode] = React.useState("signin"); // "signin" | "signup" | "track"
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPhone, setRegPhone] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [verifyNotice, setVerifyNotice] = React.useState("");
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(false);

  // Track Order State
  const [trackQuery, setTrackQuery] = React.useState("");
  const [trackResult, setTrackResult] = React.useState(null);

  // Sync auth on change
  React.useEffect(() => {
    const handleAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener("socialpeak_auth_changed", handleAuth);
    window.addEventListener("socialpeak_orders_updated", () => setCurrentUser(getCurrentUser()));
    return () => {
      window.removeEventListener("socialpeak_auth_changed", handleAuth);
    };
  }, []);

  const userOrders = React.useMemo(() => {
    if (!currentUser) return [];
    return getUserOrders(currentUser.email);
  }, [currentUser]);

  const activeOrders = React.useMemo(() => {
    return userOrders.filter(o => o.status === "Completed" || o.status === "Active");
  }, [userOrders]);

  const pendingOrders = React.useMemo(() => {
    return userOrders.filter(o => o.status === "Pending");
  }, [userOrders]);

  const completedCount = activeOrders.length;

  const [isRewardRedeemed, setIsRewardRedeemed] = React.useState(() => {
    if (typeof window === "undefined" || !currentUser || !currentUser.email) return false;
    return localStorage.getItem("socialpeak_reward_redeemed_" + currentUser.email.toLowerCase()) === "true";
  });

  React.useEffect(() => {
    if (currentUser && currentUser.email) {
      setIsRewardRedeemed(localStorage.getItem("socialpeak_reward_redeemed_" + currentUser.email.toLowerCase()) === "true");
    } else {
      setIsRewardRedeemed(false);
    }
  }, [currentUser]);

  const isAdmin = currentUser && (
    currentUser.isAdmin === true ||
    (currentUser.email && currentUser.email.toLowerCase() === "socialpeak@gmail.com") ||
    (currentUser.email && currentUser.email.toLowerCase() === "admin@gmail.com") ||
    (typeof window !== "undefined" && sessionStorage.getItem("socialpeak_admin_auth") === "true")
  );

  if (isAdmin) {
    return jsx(AdminPage, {});
  }

  const handleRedeemReward = () => {
    addToCart({
      id: "surprise-gift",
      name: "Surprise Gift",
      price: 0,
      quantity: 1,
      tagline: "VIP 5-Orders Reward Unlocked • Free",
      image: "/images/product-other-DgUge5Fh.jpg"
    });
    if (currentUser && currentUser.email) {
      localStorage.setItem("socialpeak_reward_redeemed_" + currentUser.email.toLowerCase(), "true");
    }
    setIsRewardRedeemed(true);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError("");
    setVerifyNotice("");
    if (!loginEmail || !loginPassword) return;
    setIsLoadingAuth(true);
    try {
      const res = await loginUser(loginEmail, loginPassword);
      if (!res || !res.success) {
        if (res && res.needsEmailConfirmation) {
          setVerifyNotice(res.error || "Please verify your email address via the link sent to your inbox before signing in.");
        } else {
          setAuthError((res && res.error) || "Login failed. Please check your credentials.");
        }
      } else {
        setCurrentUser(res.user);
        setLoginEmail("");
        setLoginPassword("");
      }
    } catch (err) {
      setAuthError(err.message || "Login failed");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError("");
    setVerifyNotice("");
    if (!regEmail || !regPassword) return;
    setIsLoadingAuth(true);
    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });
      if (!res || !res.success) {
        setAuthError((res && res.error) || "Registration failed");
      } else {
        if (res.needsEmailConfirmation) {
          setVerifyNotice("A verification email with an activation link has been sent to " + regEmail + ". Please check your inbox (and spam folder) and click the link to verify your account before signing in.");
          setAuthMode("signin");
          setLoginEmail(regEmail);
        } else {
          setCurrentUser(res.user);
        }
        setRegName("");
        setRegEmail("");
        setRegPhone("");
        setRegPassword("");
      }
    } catch (err) {
      setAuthError(err.message || "Registration failed");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const all = getOrders();
    const q = trackQuery.trim().toLowerCase();
    const found = all.find(o => 
      o.id.toLowerCase() === q ||
      (o.email && o.email.toLowerCase() === q) ||
      (o.phone && o.phone.includes(q)) ||
      (o.utr && o.utr.toLowerCase() === q)
    );
    if (found) {
      setTrackResult(found);
    } else {
      setTrackResult("NOT_FOUND");
    }
  };

  return jsx(SiteChrome, {
    children: jsxs("div", {
      className: "animate-fade-in max-w-3xl mx-auto account-page-container px-3 sm:px-4",
      children: [
        currentUser ? (
          // ================= LOGGED IN PROFILE VIEW =================
          jsxs("div", {
            className: "space-y-5",
            children: [
              // 1. Profile Summary Card
              jsxs("div", {
                className: "rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4",
                children: [
                  // Avatar & User Details
                  jsxs("div", {
                    className: "flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left",
                    children: [
                      jsxs("div", {
                        className: "user-avatar bg-olive/15 text-olive font-bold text-2xl font-display shadow-xs shrink-0",
                        children: (currentUser.name ? currentUser.name[0] : currentUser.email[0] || "U").toUpperCase()
                      }),
                      jsxs("div", {
                        children: [
                          jsxs("div", {
                            className: "flex flex-wrap items-center justify-center sm:justify-start gap-2",
                            children: [
                              jsx("h1", {
                                className: "font-display text-2xl text-foreground",
                                children: currentUser.name || "Member Account"
                              }),
                              jsx("span", {
                                className: "inline-flex items-center gap-1 rounded-full bg-olive/10 text-olive px-2.5 py-0.5 text-[11px] font-semibold",
                                children: [jsx(CheckCircleIcon, { className: "h-3 w-3" }), "Active Member"]
                              })
                            ]
                          }),
                          jsx("p", {
                            className: "text-xs font-mono text-muted-foreground mt-0.5",
                            children: currentUser.email
                          }),
                          currentUser.phone && jsxs("p", {
                            className: "text-xs text-muted-foreground mt-0.5",
                            children: ["WhatsApp: ", currentUser.phone]
                          })
                        ]
                      })
                    ]
                  }),

                  // Sign Out Button
                  jsx("button", {
                    onClick: handleSignOut,
                    className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition cursor-pointer",
                    children: [
                      jsx(LogOutIcon, { className: "h-3.5 w-3.5" }),
                      "Sign Out"
                    ]
                  })
                ]
              }),

              // 2. Surprise Gift Loyalty Step Tracker (1-2-3-4-5) - No text, strictly step numbers
              !isRewardRedeemed && jsxs("div", {
                className: "rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4",
                children: [
                  jsxs("div", {
                    className: "flex items-center justify-between w-full max-w-sm sm:max-w-md mx-auto px-2",
                    children: [1, 2, 3, 4, 5].map((step, idx) => {
                      const isDone = completedCount >= step;
                      return jsxs(React.Fragment, {
                        key: step,
                        children: [
                          idx > 0 && jsx("div", {
                            className: `flex-1 h-0.5 sm:h-1 mx-1.5 sm:mx-2 rounded-full transition-all duration-300 ${
                              completedCount >= step ? "bg-olive" : "bg-border"
                            }`
                          }),
                          jsx("div", {
                            className: `w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 ${
                              isDone
                                ? "bg-olive text-black shadow-xs ring-2 ring-olive/30"
                                : "border border-border text-muted-foreground bg-secondary"
                            }`,
                            children: step
                          })
                        ]
                      });
                    })
                  }),

                  // Explanatory note below the steps:
                  jsx("p", {
                    className: "text-center text-xs sm:text-sm font-medium text-muted-foreground pt-1",
                    children: completedCount >= 5 ? (
                      jsxs("span", {
                        className: "text-olive font-bold inline-flex items-center gap-1.5",
                        children: [
                          jsx(GiftIcon, { className: "h-4 w-4 text-olive shrink-0" }),
                          "Congratulations! 5 orders completed — Your Surprise Gift is unlocked!"
                        ]
                      })
                    ) : (
                      jsxs("span", {
                        className: "inline-flex items-center gap-1.5 text-foreground/80",
                        children: [
                          jsx(GiftIcon, { className: "h-3.5 w-3.5 text-olive shrink-0" }),
                          `Complete ${Math.max(1, 5 - completedCount)} more purchase${5 - completedCount === 1 ? "" : "s"} to unlock surprise gift`
                        ]
                      })
                    )
                  }),

                  // Redeem Reward Button (appears when 5 orders are completed)
                  completedCount >= 5 && jsx("div", {
                    className: "flex justify-center pt-1 animate-fade-in",
                    children: jsxs("button", {
                      type: "button",
                      onClick: handleRedeemReward,
                      className: "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-olive text-black font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer",
                      children: [
                        jsx(GiftIcon, { className: "h-4 w-4" }),
                        "Redeem Reward"
                      ]
                    })
                  })
                ]
              }),

              // 3. Section Tabs: Active Orders & Pending Orders
              jsxs("div", {
                className: "space-y-4",
                children: [
                  jsxs("div", {
                    className: "grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-background border border-border text-sm font-semibold",
                    children: [
                      jsxs("button", {
                        type: "button",
                        onClick: () => setOrderTab("active"),
                        className: `py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                          orderTab === "active"
                            ? "bg-card text-foreground shadow-xs border border-border/60"
                            : "text-muted-foreground hover:text-foreground"
                        }`,
                        children: [
                          jsx(CheckCircleIcon, { className: "h-4 w-4 text-olive" }),
                          "Active Orders",
                          jsx("span", {
                            className: "text-xs px-2 py-0.5 rounded-full bg-olive/15 text-olive font-mono",
                            children: activeOrders.length
                          })
                        ]
                      }),
                      jsxs("button", {
                        type: "button",
                        onClick: () => setOrderTab("pending"),
                        className: `py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                          orderTab === "pending"
                            ? "bg-card text-foreground shadow-xs border border-border/60"
                            : "text-muted-foreground hover:text-foreground"
                        }`,
                        children: [
                          jsx(ClockIcon, { className: "h-4 w-4 text-amber-600" }),
                          "Pending Orders",
                          jsx("span", {
                            className: "text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 font-mono",
                            children: pendingOrders.length
                          })
                        ]
                      })
                    ]
                  }),

                  // Orders List Container
                  (orderTab === "active" ? activeOrders : pendingOrders).length === 0 ? (
                    // Empty Orders State
                    jsxs("div", {
                      className: "rounded-2xl border border-border bg-card p-10 text-center shadow-sm space-y-4 animate-fade-in",
                      children: [
                        jsxs("div", {
                          className: "mx-auto h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground",
                          children: [jsx(PackageIcon, { className: "h-7 w-7" })]
                        }),
                        jsxs("div", {
                          children: [
                            jsx("h4", {
                              className: "font-semibold text-base",
                              children: orderTab === "active" ? "No Active Orders" : "No Pending Orders"
                            }),
                            jsx("p", {
                              className: "text-xs text-muted-foreground mt-1 max-w-xs mx-auto",
                              children: orderTab === "active" 
                                ? "You do not have any activated orders at this moment."
                                : "No orders are currently waiting for payment verification."
                            })
                          ]
                        }),
                        jsx(Link, {
                          to: "/services",
                          className: "inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-xs font-semibold hover:opacity-90 transition",
                          children: "Browse Shop & Services →"
                        })
                      ]
                    })
                  ) : (
                    // Render Orders
                    jsxs("div", {
                      className: "space-y-4 animate-fade-in",
                      children: (orderTab === "active" ? activeOrders : pendingOrders).map((order) => (
                        jsxs("div", {
                          key: order.id,
                          className: "sp-order-card",
                          children: [
                            // Header row
                            jsxs("div", {
                              className: "flex items-center justify-between flex-wrap gap-2 pb-1",
                              children: [
                                jsxs("div", {
                                  children: [
                                    jsxs("div", {
                                      className: "flex items-center gap-2",
                                      children: [
                                        jsx("span", {
                                          className: "font-mono font-bold text-sm bg-secondary px-2.5 py-1 rounded-md text-foreground",
                                          children: order.id
                                        })
                                      ]
                                    }),
                                    jsx("p", {
                                      className: "text-[11px] text-muted-foreground mt-1.5",
                                      children: new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })
                                    })
                                  ]
                                }),
                                jsx("span", {
                                  className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "Completed" || order.status === "Active"
                                      ? "bg-olive/15 text-olive"
                                      : "bg-amber-500/15 text-amber-700"
                                  }`,
                                  children: [
                                    order.status === "Completed" ? jsx(CheckCircleIcon, { className: "h-3.5 w-3.5" }) : jsx(ClockIcon, { className: "h-3.5 w-3.5" }),
                                    order.status === "Completed" ? "Activated & Active" : "Pending Verification"
                                  ]
                                })
                              ]
                            }),

                            // Items breakdown in distinct card box
                            jsxs("div", {
                              className: "order-items-box",
                              children: order.items && order.items.length ? (
                                order.items.map((it, idx) => (
                                  jsxs("div", {
                                    key: idx,
                                    className: "flex justify-between items-center text-xs",
                                    children: [
                                      jsxs("span", {
                                        className: "text-foreground font-semibold flex items-center gap-1.5",
                                        children: [
                                          it.name,
                                          it.quantity > 1 ? jsx("span", { className: "text-[11px] text-muted-foreground font-normal", children: `(×${it.quantity})` }) : ""
                                        ]
                                      }),
                                      jsx("span", {
                                        className: "font-mono font-bold text-foreground",
                                        children: `₹${Number(it.price) * (it.quantity || 1)}`
                                      })
                                    ]
                                  })
                                ))
                              ) : (
                                jsxs("div", {
                                  className: "flex justify-between items-center text-xs",
                                  children: [
                                    jsx("span", { className: "text-foreground font-medium", children: "Standard Activation Plan" }),
                                    jsx("span", { className: "font-mono font-bold text-foreground", children: `₹${order.total}` })
                                  ]
                                })
                              )
                            }),

                            // Meta row: UTR and Total
                            jsxs("div", {
                              className: "order-meta-box",
                              children: [
                                jsxs("div", {
                                  className: "space-y-0.5",
                                  children: [
                                    jsx("span", { className: "text-muted-foreground text-xs", children: "Payment UTR: " }),
                                    jsx("span", { className: "font-mono font-semibold text-foreground text-xs block", children: order.utr || "N/A" })
                                  ]
                                }),
                                jsxs("div", {
                                  className: "text-right",
                                  children: [
                                    jsx("span", { className: "text-muted-foreground text-xs", children: "Total Paid: " }),
                                    jsx("span", { className: "font-display text-lg font-bold text-olive block", children: `₹${order.total}` })
                                  ]
                                })
                              ]
                            }),

                            // Support contact action
                            jsx("a", {
                              href: `https://wa.me/919250806417?text=${encodeURIComponent(
                                `Hi Socialpeak.store, inquiring about my order ${order.id}. Email: ${order.email}. Status: ${order.status}. UTR: ${order.utr}.`
                              )}`,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 py-2.5 px-4 text-xs font-bold text-[#1e9146] hover:bg-[#25D366]/20 transition cursor-pointer mt-1",
                              children: [
                                jsx(MessageCircleIcon, { className: "h-4 w-4" }),
                                "WhatsApp Support for this Order"
                              ]
                            })
                          ]
                        })
                      ))
                    })
                  )
                ]
              })
            ]
          })
        ) : (
          // ================= NOT LOGGED IN / AUTH FLOW =================
          jsxs("div", {
            className: "space-y-6",
            children: [
              // Header
              jsxs("div", {
                className: "text-center mb-6",
                children: [
                  jsxs("div", {
                    className: "mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold shadow-sm",
                    children: [
                      jsx(ZapIcon, { className: "h-3.5 w-3.5 text-olive" }),
                      jsx("span", { children: "Member Portal" })
                    ]
                  }),
                  jsxs("h1", {
                    className: "store-heading",
                    children: [
                      "Member ",
                      jsx("span", { className: "italic text-olive", children: "Login" })
                    ]
                  }),
                  jsx("p", {
                    className: "mt-2 text-sm text-muted-foreground",
                    children: "Sign in to view your active activations, pending orders and rewards."
                  })
                ]
              }),

              // Auth Card
              jsxs("div", {
                className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6",
                children: [
                  // Segmented Tabs
                  jsxs("div", {
                    className: "auth-tabs-box mb-6 grid grid-cols-3 gap-1 rounded-xl bg-background p-1 border border-border text-xs font-medium",
                    children: [
                      jsx("button", {
                        onClick: () => { setAuthMode("signin"); setAuthError(""); },
                        className: `py-2 rounded-lg transition cursor-pointer ${authMode === "signin" ? "bg-card font-semibold text-foreground shadow-xs border border-border/50" : "text-muted-foreground hover:text-foreground"}`,
                        children: "Sign In"
                      }),
                      jsx("button", {
                        onClick: () => { setAuthMode("signup"); setAuthError(""); },
                        className: `py-2 rounded-lg transition cursor-pointer ${authMode === "signup" ? "bg-card font-semibold text-foreground shadow-xs border border-border/50" : "text-muted-foreground hover:text-foreground"}`,
                        children: "Register"
                      }),
                      jsx("button", {
                        onClick: () => { setAuthMode("track"); setAuthError(""); },
                        className: `py-2 rounded-lg transition cursor-pointer ${authMode === "track" ? "bg-card font-semibold text-foreground shadow-xs border border-border/50" : "text-muted-foreground hover:text-foreground"}`,
                        children: "Track Order"
                      })
                    ]
                  }),

                  verifyNotice && jsx("div", {
                    className: "p-4 rounded-2xl bg-olive/15 border border-olive/35 text-foreground text-xs leading-relaxed flex items-start gap-3 animate-fade-in",
                    children: [
                      jsx("span", { className: "text-lg shrink-0", children: "✉️" }),
                      jsxs("div", {
                        className: "space-y-1",
                        children: [
                          jsx("p", { className: "font-bold text-olive", children: "Verification Link Sent" }),
                          jsx("p", { className: "text-muted-foreground", children: verifyNotice })
                        ]
                      })
                    ]
                  }),

                  authError && jsx("div", {
                    className: "p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium text-center",
                    children: authError
                  }),

                  // 1. Sign In Form
                  authMode === "signin" ? (
                    jsxs("form", {
                      onSubmit: handleSignIn,
                      className: "mt-6 space-y-4 animate-fade-in",
                      children: [
                        jsxs("div", {
                          children: [
                            jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Email Address" }),
                            jsx("input", {
                              type: "email",
                              required: true,
                              placeholder: "name@example.com",
                              value: loginEmail,
                              onChange: e => setLoginEmail(e.target.value),
                              className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                            })
                          ]
                        }),
                        jsxs("div", {
                          children: [
                            jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Password" }),
                            jsx("input", {
                              type: "password",
                              required: true,
                              placeholder: "••••••••",
                              value: loginPassword,
                              onChange: e => setLoginPassword(e.target.value),
                              className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                            })
                          ]
                        }),
                        jsx("button", {
                          type: "submit",
                          disabled: isLoadingAuth,
                          className: `w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 shadow transition cursor-pointer ${isLoadingAuth ? "opacity-60 cursor-not-allowed" : ""}`,
                          children: isLoadingAuth ? "Signing In..." : "Sign In to Account"
                        }),
                        jsx("p", {
                          className: "text-center text-xs text-muted-foreground pt-1",
                          children: "Don't have an account? Click 'Register' above."
                        })
                      ]
                    })
                  ) : authMode === "signup" ? (
                    // 2. Register Form
                    jsxs("form", {
                      onSubmit: handleSignUp,
                      className: "mt-6 space-y-4 animate-fade-in",
                      children: [
                        jsxs("div", {
                          children: [
                            jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Your Full Name" }),
                            jsx("input", {
                              type: "text",
                              required: true,
                              placeholder: "Enter your full name",
                              value: regName,
                              onChange: e => setRegName(e.target.value),
                              className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                            })
                          ]
                        }),
                        jsxs("div", {
                          children: [
                            jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Email Address" }),
                            jsx("input", {
                              type: "email",
                              required: true,
                              placeholder: "name@example.com",
                              value: regEmail,
                              onChange: e => setRegEmail(e.target.value),
                              className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                            })
                          ]
                        }),
                        jsxs("div", {
                          children: [
                            jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "WhatsApp Phone Number" }),
                            jsx("input", {
                              type: "tel",
                              placeholder: "+91 98765 43210",
                              value: regPhone,
                              onChange: e => setRegPhone(e.target.value),
                              className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                            })
                          ]
                        }),
                        jsxs("div", {
                          children: [
                            jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Password" }),
                            jsx("input", {
                              type: "password",
                              required: true,
                              placeholder: "••••••••",
                              value: regPassword,
                              onChange: e => setRegPassword(e.target.value),
                              className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                            })
                          ]
                        }),
                        jsx("button", {
                          type: "submit",
                          disabled: isLoadingAuth,
                          className: `w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 shadow transition cursor-pointer ${isLoadingAuth ? "opacity-60 cursor-not-allowed" : ""}`,
                          children: isLoadingAuth ? "Sending Verification Link..." : "Create Member Account"
                        })
                      ]
                    })
                  ) : (
                    // 3. Track Order Form
                    jsxs("div", {
                      className: "mt-6 space-y-4 animate-fade-in",
                      children: [
                        jsxs("form", {
                          onSubmit: handleTrackSearch,
                          className: "space-y-4",
                          children: [
                            jsxs("div", {
                              children: [
                                jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Order ID, Registered Email or UTR" }),
                                jsx("input", {
                                  type: "text",
                                  required: true,
                                  placeholder: "e.g. SP-841920 or aman.sharma@example.com",
                                  value: trackQuery,
                                  onChange: e => setTrackQuery(e.target.value),
                                  className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                                })
                              ]
                            }),
                            jsx("button", {
                              type: "submit",
                              className: "w-full rounded-full bg-foreground text-card py-2.5 text-sm font-semibold hover:bg-olive transition cursor-pointer",
                              children: "Track Order Status"
                            })
                          ]
                        }),

                        trackResult === "NOT_FOUND" ? (
                          jsx("div", {
                            className: "p-4 rounded-xl border border-border bg-background text-center text-xs text-muted-foreground",
                            children: "No order found matching your inquiry. Please check your Order ID or contact support."
                          })
                        ) : trackResult ? (
                          jsxs("div", {
                            className: "p-4 rounded-xl border border-border bg-background space-y-2 text-xs",
                            children: [
                              jsxs("div", {
                                className: "flex justify-between items-center pb-2 border-b border-border font-bold",
                                children: [
                                  jsx("span", { children: trackResult.id }),
                                  jsx("span", {
                                    className: `px-2 py-0.5 rounded-full text-[11px] ${
                                      trackResult.status === "Completed" ? "bg-olive/15 text-olive" : "bg-amber-500/15 text-amber-700"
                                    }`,
                                    children: trackResult.status
                                  })
                                ]
                              }),
                              jsxs("div", {
                                className: "flex justify-between text-muted-foreground",
                                children: [
                                  jsx("span", { children: "Customer" }),
                                  jsx("span", { className: "font-semibold text-foreground", children: trackResult.customerName })
                                ]
                              }),
                              jsxs("div", {
                                className: "flex justify-between text-muted-foreground",
                                children: [
                                  jsx("span", { children: "Total" }),
                                  jsx("span", { className: "font-bold text-olive", children: `₹${trackResult.total}` })
                                ]
                              })
                            ]
                          })
                        ) : null
                      ]
                    })
                  )
                ]
              })
            ]
          })
        )
      ]
    })
  });
}

export { AccountPage as component };