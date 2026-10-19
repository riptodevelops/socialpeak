import { l as getReact, s as getReactCore, o as getJsx } from "./useSelector-C0pj3Bsi.js";
import { r as Link } from "./client-DPgd7H-W.js";
import { a as ZapIcon, c as createIcon, n as Button, t as SiteChrome } from "./SiteChrome-BCifFRZP.js";
import {
  getOrders,
  updateOrderStatus,
  getProducts,
  getProductImage,
  addProduct,
  updateProduct,
  deleteProduct,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin
} from "./store.js";

const React = getReact(getReactCore());
const { jsx, jsxs } = getJsx();

const ShieldIcon = createIcon("shield-check", [
  ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", key: "s1" }],
  ["path", { d: "m9 12 2 2 4-4", key: "s2" }]
]);

const CheckIcon = createIcon("check", [
  ["path", { d: "M20 6 9 17l-5-5", key: "c1" }]
]);

const XIcon = createIcon("x", [
  ["path", { d: "M18 6 6 18", key: "x1" }],
  ["path", { d: "m6 6 12 12", key: "x2" }]
]);

const TrashIcon = createIcon("trash-2", [
  ["path", { d: "M3 6h18", key: "t1" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "t2" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "t3" }]
]);

const EditIcon = createIcon("edit", [
  ["path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "e1" }],
  ["path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", key: "e2" }]
]);

const PlusIcon = createIcon("plus", [
  ["path", { d: "M5 12h14", key: "p1" }],
  ["path", { d: "M12 5v14", key: "p2" }]
]);

const ClockIcon = createIcon("clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "cl1" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "cl2" }]
]);

function AdminPage() {
  const [isAdmin, setIsAdmin] = React.useState(() => isAdminAuthenticated());
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");

  // Dashboard Tab: "pending" | "completed" | "products"
  const [tab, setTab] = React.useState("pending");
  const [orders, setOrders] = React.useState(() => getOrders());
  const [products, setProducts] = React.useState(() => getProducts());

  // Product Add / Edit Modal State
  const [showProductModal, setShowProductModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [prodName, setProdName] = React.useState("");
  const [prodPrice, setProdPrice] = React.useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = React.useState("");
  const [prodCategory, setProdCategory] = React.useState("entertainment");
  const [prodTagline, setProdTagline] = React.useState("");
  const [prodDescription, setProdDescription] = React.useState("");
  const [prodImage, setProdImage] = React.useState("");

  React.useEffect(() => {
    const handleOrders = () => setOrders(getOrders());
    const handleProducts = () => setProducts(getProducts());
    window.addEventListener("socialpeak_orders_updated", handleOrders);
    window.addEventListener("socialpeak_products_updated", handleProducts);
    return () => {
      window.removeEventListener("socialpeak_orders_updated", handleOrders);
      window.removeEventListener("socialpeak_products_updated", handleProducts);
    };
  }, []);

  React.useEffect(() => {
    if (showProductModal) {
      const prevOverflow = document.body.style.overflow;
      const prevTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouchAction;
      };
    }
  }, [showProductModal]);

  const pendingOrders = React.useMemo(() => {
    return orders.filter(o => o.status === "Pending");
  }, [orders]);

  const completedOrders = React.useMemo(() => {
    return orders.filter(o => o.status === "Completed" || o.status === "Active");
  }, [orders]);

  React.useEffect(() => {
    // If a regular user who is not admin attempts to access, redirect to home page
    if (typeof window !== "undefined") {
      try {
        const u = JSON.parse(localStorage.getItem("socialpeak_user") || "null");
        const adminSession = sessionStorage.getItem("socialpeak_admin_auth") === "true";
        if (u && u.email && u.email.toLowerCase() !== "socialpeak@gmail.com" && u.email.toLowerCase() !== "admin@gmail.com" && !adminSession && !u.isAdmin) {
          window.location.replace("/");
          return;
        }
      } catch (err) {}
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(username.trim(), password.trim())) {
      setIsAdmin(true);
      setLoginError("");
    } else {
      setLoginError("Unauthorised access! Redirecting to home page...");
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.replace("/");
        }
      }, 1000);
    }
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdCategory("entertainment");
    setProdTagline("");
    setProdDescription("");
    setProdImage("");
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : "");
    setProdCategory(prod.category || "entertainment");
    setProdTagline(prod.tagline || "");
    setProdDescription(prod.description || "");
    setProdImage(prod.image || getProductImage(prod));
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) return;
    const origPriceVal = (prodOriginalPrice && prodOriginalPrice.trim() && !isNaN(Number(prodOriginalPrice)) && Number(prodOriginalPrice) > 0)
      ? Number(prodOriginalPrice)
      : null;
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName.trim(),
        price: Number(prodPrice),
        originalPrice: origPriceVal,
        category: prodCategory,
        tagline: prodTagline.trim(),
        description: prodDescription.trim(),
        image: prodImage.trim()
      });
    } else {
      addProduct({
        name: prodName.trim(),
        price: Number(prodPrice),
        originalPrice: origPriceVal,
        category: prodCategory,
        tagline: prodTagline.trim(),
        description: prodDescription.trim(),
        image: prodImage.trim()
      });
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return jsx(SiteChrome, {
    children: jsxs("div", {
      className: "animate-fade-in max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-4",
      children: [
        !isAdmin ? (
          // ================= ADMIN LOGIN SCREEN =================
          jsxs("div", {
            className: "max-w-md mx-auto my-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5 text-center animate-fade-up",
            children: [
              jsxs("div", {
                className: "mx-auto h-16 w-16 rounded-full bg-olive/15 text-olive flex items-center justify-center font-bold",
                children: [jsx(ShieldIcon, { className: "h-8 w-8 stroke-[2]" })]
              }),
              jsxs("div", {
                children: [
                  jsx("h1", { className: "font-display text-2xl text-foreground", children: "Admin Control Center" }),
                  jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Sign in with admin credentials to manage orders & catalog." })
                ]
              }),

              loginError && jsx("div", {
                className: "p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold",
                children: loginError
              }),

              jsxs("form", {
                onSubmit: handleAdminLogin,
                className: "space-y-4 text-left",
                children: [
                  jsxs("div", {
                    children: [
                      jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Admin Email / Username" }),
                      jsx("input", {
                        type: "text",
                        required: true,
                        placeholder: "socialpeak@gmail.com",
                        value: username,
                        onChange: e => setUsername(e.target.value),
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
                        value: password,
                        onChange: e => setPassword(e.target.value),
                        className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                      })
                    ]
                  }),
                  jsx("button", {
                    type: "submit",
                    className: "w-full rounded-full bg-foreground text-card py-3 text-sm font-semibold hover:bg-olive transition cursor-pointer shadow-sm",
                    children: "Enter Admin Dashboard"
                  }),
                  jsx(Link, {
                    to: "/",
                    className: "w-full inline-flex items-center justify-center rounded-full border border-border bg-background py-2.5 text-xs font-semibold text-muted-foreground hover:bg-accent transition cursor-pointer",
                    children: "← Return to Home"
                  })
                ]
              })
            ]
          })
        ) : (
          // ================= ADMIN DASHBOARD =================
          jsxs("div", {
            className: "space-y-6",
            children: [
              // Dashboard Header
              jsxs("div", {
                className: "rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4",
                children: [
                  jsxs("div", {
                    className: "flex items-center gap-3 text-center sm:text-left",
                    children: [
                      jsxs("div", {
                        className: "h-12 w-12 rounded-xl bg-olive text-white flex items-center justify-center font-bold",
                        children: [jsx(ShieldIcon, { className: "h-6 w-6" })]
                      }),
                      jsxs("div", {
                        children: [
                          jsx("h1", { className: "font-display text-2xl text-foreground", children: "Socialpeak Admin" }),
                          jsx("p", { className: "text-xs text-muted-foreground", children: "Live Management: Orders, Payments, UTR Verification & Catalog" })
                        ]
                      })
                    ]
                  }),

                  jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      jsx(Link, {
                        to: "/",
                        className: "inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-accent transition",
                        children: "View Storefront ↗"
                      }),
                      jsx("button", {
                        onClick: handleAdminLogout,
                        className: "inline-flex items-center rounded-full bg-destructive/10 text-destructive px-4 py-2 text-xs font-semibold hover:bg-destructive/20 transition cursor-pointer",
                        children: "Logout Admin"
                      })
                    ]
                  })
                ]
              }),

              // Navigation Tabs
              jsxs("div", {
                className: "grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-semibold",
                children: [
                  jsxs("button", {
                    type: "button",
                    onClick: () => setTab("pending"),
                    className: `py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                      tab === "pending"
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
                  }),
                  jsxs("button", {
                    type: "button",
                    onClick: () => setTab("completed"),
                    className: `py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                      tab === "completed"
                        ? "bg-card text-foreground shadow-xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`,
                    children: [
                      jsx(CheckIcon, { className: "h-4 w-4 text-olive" }),
                      "Completed Orders",
                      jsx("span", {
                        className: "text-xs px-2 py-0.5 rounded-full bg-olive/15 text-olive font-mono",
                        children: completedOrders.length
                      })
                    ]
                  }),
                  jsxs("button", {
                    type: "button",
                    onClick: () => setTab("products"),
                    className: `py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                      tab === "products"
                        ? "bg-card text-foreground shadow-xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`,
                    children: [
                      jsx(ZapIcon, { className: "h-4 w-4 text-olive" }),
                      "Products Catalog",
                      jsx("span", {
                        className: "text-xs px-2 py-0.5 rounded-full bg-secondary font-mono",
                        children: products.length
                      })
                    ]
                  })
                ]
              }),

              // TAB 1: PENDING ORDERS
              tab === "pending" && (
                pendingOrders.length === 0 ? (
                  jsx("div", {
                    className: "rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground text-sm",
                    children: "No pending orders! All activation requests have been processed."
                  })
                ) : (
                  jsxs("div", {
                    className: "space-y-4 animate-fade-in",
                    children: pendingOrders.map((order) => (
                      jsxs("div", {
                        key: order.id,
                        className: "rounded-2xl border border-amber-500/30 bg-card p-5 sm:p-6 shadow-sm space-y-4",
                        children: [
                          // Header
                          jsxs("div", {
                            className: "flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border",
                            children: [
                              jsxs("div", {
                                children: [
                                  jsxs("span", { className: "font-mono font-bold text-base", children: [order.id] }),
                                  jsx("span", { className: "ml-2.5 inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 px-2.5 py-0.5 text-xs font-semibold", children: "Pending Verification" }),
                                  jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(order.createdAt).toLocaleString("en-IN") })
                                ]
                              }),
                              jsxs("div", {
                                className: "text-right",
                                children: [
                                  jsx("span", { className: "text-xs text-muted-foreground", children: "Payment Amount" }),
                                  jsx("p", { className: "font-display text-2xl font-bold text-olive", children: `₹${order.total}` })
                                ]
                              })
                            ]
                          }),

                          // Customer Details Grid
                          jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-background p-3.5 text-xs border border-border",
                            children: [
                              jsxs("div", {
                                children: [
                                  jsx("span", { className: "text-muted-foreground block text-[11px]", children: "Customer Name" }),
                                  jsx("span", { className: "font-semibold text-foreground", children: order.customerName })
                                ]
                              }),
                              jsxs("div", {
                                children: [
                                  jsx("span", { className: "text-muted-foreground block text-[11px]", children: "Email" }),
                                  jsx("span", { className: "font-mono font-medium text-foreground", children: order.email })
                                ]
                              }),
                              jsxs("div", {
                                children: [
                                  jsx("span", { className: "text-muted-foreground block text-[11px]", children: "WhatsApp Phone" }),
                                  jsx("span", { className: "font-mono font-medium text-foreground", children: order.phone || "Not provided" })
                                ]
                              })
                            ]
                          }),

                          // UTR highlight box
                          jsxs("div", {
                            className: "p-3 rounded-xl bg-olive/10 border border-olive/30 flex items-center justify-between flex-wrap gap-2 text-xs",
                            children: [
                              jsxs("div", {
                                children: [
                                  jsx("span", { className: "font-semibold text-muted-foreground", children: "Submitted UTR / Transaction ID: " }),
                                  jsx("span", { className: "font-mono font-bold text-foreground text-sm", children: order.utr || "N/A" })
                                ]
                              }),
                              order.notes && jsxs("div", {
                                className: "text-muted-foreground italic",
                                children: [`Notes: "${order.notes}"`]
                              })
                            ]
                          }),

                          // Ordered Items
                          jsxs("div", {
                            className: "text-xs space-y-1.5",
                            children: [
                              jsx("span", { className: "font-semibold text-muted-foreground block", children: "Ordered Items:" }),
                              order.items && order.items.map((it, idx) => (
                                jsxs("div", {
                                  key: idx,
                                  className: "flex justify-between text-muted-foreground",
                                  children: [
                                    jsxs("span", { className: "text-foreground font-medium", children: [`• ${it.name}`, it.quantity > 1 ? ` (×${it.quantity})` : ""] }),
                                    jsx("span", { className: "font-mono", children: `₹${Number(it.price) * (it.quantity || 1)}` })
                                  ]
                                })
                              ))
                            ]
                          }),

                          // Action Buttons: Approve / Reject
                          jsxs("div", {
                            className: "pt-2 flex flex-col sm:flex-row items-center gap-2",
                            children: [
                              jsx("button", {
                                onClick: () => handleStatusChange(order.id, "Completed"),
                                className: "w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-olive text-white py-2.5 px-4 text-xs font-bold hover:opacity-90 shadow-xs cursor-pointer transition",
                                children: [
                                  jsx(CheckIcon, { className: "h-4 w-4" }),
                                  "Approve & Mark Activated"
                                ]
                              }),
                              jsx("button", {
                                onClick: () => handleStatusChange(order.id, "Rejected"),
                                className: "w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-destructive/40 text-destructive py-2.5 px-4 text-xs font-semibold hover:bg-destructive/10 cursor-pointer transition",
                                children: [
                                  jsx(XIcon, { className: "h-4 w-4" }),
                                  "Reject"
                                ]
                              }),
                              order.phone && jsx("a", {
                                href: `https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hi ${order.customerName}, this is Socialpeak.store regarding your Order ${order.id}. Your payment of ₹${order.total} (UTR: ${order.utr}) has been verified and your product is activated!`
                                )}`,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-white py-2.5 px-4 text-xs font-bold hover:opacity-90 cursor-pointer transition",
                                children: "Chat Customer 💬"
                              })
                            ]
                          })
                        ]
                      })
                    ))
                  })
                )
              ),

              // TAB 2: COMPLETED ORDERS
              tab === "completed" && (
                completedOrders.length === 0 ? (
                  jsx("div", {
                    className: "rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground text-sm",
                    children: "No completed orders yet."
                  })
                ) : (
                  jsxs("div", {
                    className: "space-y-4 animate-fade-in",
                    children: completedOrders.map((order) => (
                      jsxs("div", {
                        key: order.id,
                        className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3",
                        children: [
                          jsxs("div", {
                            className: "flex items-center justify-between pb-2 border-b border-border flex-wrap gap-2",
                            children: [
                              jsxs("div", {
                                children: [
                                  jsxs("span", { className: "font-mono font-bold text-sm", children: [order.id] }),
                                  jsx("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-olive/15 text-olive px-2.5 py-0.5 text-xs font-semibold", children: "Activated & Complete" }),
                                  jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: `${order.customerName} (${order.email})` })
                                ]
                              }),
                              jsxs("span", {
                                className: "font-display text-xl font-bold text-olive",
                                children: [`₹${order.total}`]
                              })
                            ]
                          }),
                          jsxs("div", {
                            className: "flex items-center justify-between text-xs text-muted-foreground",
                            children: [
                              jsxs("span", { children: ["UTR: ", jsx("strong", { className: "font-mono text-foreground", children: order.utr || "N/A" })] }),
                              jsxs("span", { children: [new Date(order.createdAt).toLocaleDateString("en-IN")] })
                            ]
                          })
                        ]
                      })
                    ))
                  })
                )
              ),

              // TAB 3: MANAGE PRODUCTS CATALOG
              tab === "products" && (
                jsxs("div", {
                  className: "space-y-4 animate-fade-in",
                  children: [
                    // Add Product Bar
                    jsxs("div", {
                      className: "flex items-center justify-between gap-4 flex-wrap pb-2",
                      children: [
                        jsxs("div", {
                          children: [
                            jsx("h3", { className: "font-display text-xl", children: "Catalog Management" }),
                            jsx("p", { className: "text-xs text-muted-foreground", children: "Add, edit, change prices, or delete activation services." })
                          ]
                        }),
                        jsx("button", {
                          onClick: handleOpenAddProduct,
                          className: "inline-flex items-center gap-1.5 rounded-full bg-olive text-white px-4 py-2 text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs",
                          children: [
                            jsx(PlusIcon, { className: "h-4 w-4" }),
                            "Add New Product"
                          ]
                        })
                      ]
                    }),

                    // Products Grid
                    jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
                      children: products.map((prod) => (
                        jsxs("div", {
                          key: prod.id,
                          className: "rounded-xl border border-border bg-card p-4 shadow-xs space-y-3 flex flex-col justify-between",
                          children: [
                            jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                jsxs("div", {
                                  className: "flex items-start justify-between gap-2",
                                  children: [
                                    jsxs("div", {
                                      className: "flex items-center gap-2.5 min-w-0 flex-1",
                                      children: [
                                        jsx("div", {
                                          className: "h-9 w-9 shrink-0 rounded-lg border border-border bg-background p-1 flex items-center justify-center overflow-hidden",
                                          children: jsx("img", {
                                            src: prod.image || getProductImage(prod),
                                            alt: prod.name,
                                            className: "h-full w-full object-contain",
                                            onError: (e) => { e.target.style.display = 'none'; }
                                          })
                                        }),
                                        jsx("h4", { className: "font-bold text-sm text-foreground leading-tight truncate", children: prod.name })
                                      ]
                                    }),
                                    jsxs("div", {
                                      className: "text-right shrink-0",
                                      children: [
                                        prod.originalPrice && Number(prod.originalPrice) > Number(prod.price) && jsxs("del", {
                                          className: "block text-[11px] text-muted-foreground line-through font-normal",
                                          children: [`₹`, Number(prod.originalPrice).toLocaleString("en-IN")]
                                        }),
                                        jsxs("span", {
                                          className: "font-display text-lg font-bold text-olive",
                                          children: [`₹`, Number(prod.price).toLocaleString("en-IN")]
                                        })
                                      ]
                                    })
                                  ]
                                }),
                                prod.tagline && jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: prod.tagline }),
                                prod.description && jsx("p", { className: "text-[11px] text-muted-foreground/85 line-clamp-2 italic", children: prod.description }),
                                jsxs("div", {
                                  className: "flex items-center gap-1.5 flex-wrap",
                                  children: [
                                    jsx("span", { className: "inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground", children: prod.category }),
                                    prod.originalPrice && Number(prod.originalPrice) > Number(prod.price) && jsxs("span", {
                                      className: "inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-olive/15 text-olive",
                                      children: [Math.round((1 - Number(prod.price) / Number(prod.originalPrice)) * 100), "% OFF"]
                                    })
                                  ]
                                })
                              ]
                            }),

                            // Edit / Delete Buttons
                            jsxs("div", {
                              className: "pt-2 border-t border-border flex items-center justify-end gap-2",
                              children: [
                                jsx("button", {
                                  onClick: () => handleOpenEditProduct(prod),
                                  className: "inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-secondary transition cursor-pointer",
                                  children: [jsx(EditIcon, { className: "h-3.5 w-3.5" }), "Edit"]
                                }),
                                jsx("button", {
                                  onClick: () => handleDeleteProduct(prod.id),
                                  className: "inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:bg-destructive/10 p-1.5 rounded transition cursor-pointer",
                                  children: [jsx(TrashIcon, { className: "h-3.5 w-3.5" }), "Delete"]
                                })
                              ]
                            })
                          ]
                        })
                      ))
                    })
                  ]
                })
              ),

              // ADD / EDIT PRODUCT MODAL
              showProductModal && (
                jsx("div", {
                  className: "fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto overscroll-contain touch-none",
                  onClick: (e) => { if (e.target === e.currentTarget) setShowProductModal(false); },
                  children: jsxs("div", {
                    className: "w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden my-auto animate-scale-in overscroll-contain touch-auto",
                    onClick: (e) => e.stopPropagation(),
                    children: [
                      jsxs("div", {
                        className: "flex items-center justify-between px-5 py-3.5 border-b border-border bg-card shrink-0",
                        children: [
                          jsx("h3", { className: "font-display text-lg", children: editingProduct ? "Edit Product" : "Add New Product" }),
                          jsx("button", {
                            type: "button",
                            onClick: () => setShowProductModal(false),
                            className: "h-8 w-8 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center text-lg",
                            "aria-label": "Close",
                            children: "✕"
                          })
                        ]
                      }),

                      jsxs("form", {
                        onSubmit: handleSaveProduct,
                        className: "flex flex-col flex-1 overflow-hidden min-h-0",
                        children: [
                          jsxs("div", {
                            className: "flex-1 overflow-y-auto p-5 space-y-3.5 text-xs overscroll-contain",
                            children: [
                              jsxs("div", {
                            children: [
                              jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Product Name *" }),
                              jsx("input", {
                                type: "text",
                                required: true,
                                value: prodName,
                                onChange: e => setProdName(e.target.value),
                                placeholder: "e.g. Canva Pro (1 Year)",
                                className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none"
                              })
                            ]
                          }),

                          jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
                            children: [
                              jsxs("div", {
                                children: [
                                  jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Selling Price (₹) *" }),
                                  jsx("input", {
                                    type: "number",
                                    required: true,
                                    value: prodPrice,
                                    onChange: e => setProdPrice(e.target.value),
                                    placeholder: "e.g. 49",
                                    className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none"
                                  })
                                ]
                              }),
                              jsxs("div", {
                                children: [
                                  jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Original / MRP Price (₹) (Optional)" }),
                                  jsx("input", {
                                    type: "number",
                                    value: prodOriginalPrice,
                                    onChange: e => setProdOriginalPrice(e.target.value),
                                    placeholder: "e.g. 99 (shown struck out)",
                                    className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none"
                                  })
                                ]
                              })
                            ]
                          }),

                          jsxs("div", {
                            children: [
                              jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Category" }),
                              jsxs("select", {
                                value: prodCategory,
                                onChange: e => setProdCategory(e.target.value),
                                className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none",
                                children: [
                                  jsx("option", { value: "discount", children: "🏷️ Discount Deals & Offers" }),
                                  jsx("option", { value: "entertainment", children: "Entertainment" }),
                                  jsx("option", { value: "ai-creative", children: "AI & Creative" }),
                                  jsx("option", { value: "music", children: "Music" }),
                                  jsx("option", { value: "numbers", children: "Numbers & OTP" }),
                                  jsx("option", { value: "accounts", children: "Accounts" }),
                                  jsx("option", { value: "more", children: "More Plans" })
                                ]
                              })
                            ]
                          }),

                          jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Product Image (URL / Path)" }),
                              jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  jsx("div", {
                                    className: "h-10 w-10 shrink-0 rounded-lg border border-border bg-background flex items-center justify-center overflow-hidden p-1",
                                    children: (prodImage || getProductImage({ name: prodName })) ? jsx("img", {
                                      src: prodImage || getProductImage({ name: prodName }),
                                      alt: "Preview",
                                      className: "h-full w-full object-contain",
                                      onError: (e) => { e.target.style.display = 'none'; }
                                    }) : jsx("span", { className: "text-muted-foreground text-[10px]", children: "No Img" })
                                  }),
                                  jsx("input", {
                                    type: "text",
                                    value: prodImage,
                                    onChange: e => setProdImage(e.target.value),
                                    placeholder: "/images/netflix.svg or https://...",
                                    className: "flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none"
                                  })
                                ]
                              }),
                              jsxs("div", {
                                className: "flex flex-wrap gap-1 items-center pt-0.5",
                                children: [
                                  jsx("span", { className: "text-[10px] text-muted-foreground mr-1", children: "Presets:" }),
                                  ...[
                                    { label: "Netflix", url: "/images/netflix.svg" },
                                    { label: "YouTube", url: "/images/youtube.svg" },
                                    { label: "Spotify", url: "/images/spotify.svg" },
                                    { label: "Canva", url: "/images/canva.svg" },
                                    { label: "Hotstar", url: "/images/product-hotstar-sCpbmH6z.jpg" },
                                    { label: "Apple", url: "/images/applemusic.svg" },
                                    { label: "Adobe", url: "/images/adobe.svg" },
                                    { label: "Gemini", url: "/images/googlegemini.svg" },
                                    { label: "OpenAI", url: "/images/openai.svg" },
                                    { label: "Amazon", url: "/images/amazon.svg" },
                                    { label: "WhatsApp", url: "/images/whatsapp.svg" }
                                  ].map(p => jsx("button", {
                                    key: p.label,
                                    type: "button",
                                    onClick: () => setProdImage(p.url),
                                    className: `text-[10px] px-2 py-0.5 rounded border ${
                                      prodImage === p.url ? "bg-olive text-white border-olive font-bold" : "bg-secondary text-muted-foreground hover:text-foreground border-border hover:border-olive/50"
                                    } transition cursor-pointer`,
                                    children: p.label
                                  }))
                                ]
                              })
                            ]
                          }),

                          jsxs("div", {
                            children: [
                              jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Short Tagline" }),
                              jsx("input", {
                                type: "text",
                                value: prodTagline,
                                onChange: e => setProdTagline(e.target.value),
                                placeholder: "e.g. 1 year • On your email",
                                className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none"
                              })
                            ]
                          }),

                          jsxs("div", {
                            children: [
                              jsx("label", { className: "block font-semibold text-muted-foreground mb-1", children: "Product Description (Detailed)" }),
                              jsx("textarea", {
                                rows: 3,
                                value: prodDescription,
                                onChange: e => setProdDescription(e.target.value),
                                placeholder: "Enter complete product description, validity, features, activation process...",
                                className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none resize-y"
                              })
                            ]
                          })
                        ]
                      }),

                      jsxs("div", {
                        className: "p-4 border-t border-border bg-card shrink-0 flex gap-2.5",
                        children: [
                          jsx("button", {
                            type: "button",
                            onClick: () => setShowProductModal(false),
                            className: "flex-1 rounded-full border border-border bg-background py-2.5 font-semibold text-muted-foreground hover:bg-secondary cursor-pointer",
                            children: "Cancel"
                          }),
                          jsx("button", {
                            type: "submit",
                            className: "flex-1 rounded-full bg-olive text-white py-2.5 font-bold hover:opacity-90 shadow-xs cursor-pointer",
                            children: editingProduct ? "Update Product" : "Add Product"
                          })
                        ]
                      })
                    ]
                  })
                    ]
                  })
                })
              )
            ]
          })
        )
      ]
    })
  });
}

export { AdminPage as component };