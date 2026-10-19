import { l as getReact, s as getReactCore, o as getJsx } from "./useSelector-C0pj3Bsi.js";
import { r as Link } from "./client-DPgd7H-W.js";
import { a as ZapIcon, c as createIcon, n as Button, t as SiteChrome } from "./SiteChrome-BCifFRZP.js";
import { t as allServices, r as getPrice, i as getQrCodeUrl } from "./services-DmmZwhxf.js";
import { t as MessageCircleIcon } from "./message-circle-DujXu9uS.js";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCurrentUser,
  createOrder,
  getProductImage
} from "./store.js";

const React = getReact(getReactCore());
const { jsx, jsxs } = getJsx();

const ShoppingBagIcon = createIcon("shopping-bag", [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "sb1" }],
  ["path", { d: "M3.103 6.034h17.794", key: "sb2" }],
  ["path", { d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z", key: "sb3" }]
]);

const CheckIcon = createIcon("check", [
  ["path", { d: "M20 6 9 17l-5-5", key: "c1" }]
]);

const CopyIcon = createIcon("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "cp1" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "cp2" }]
]);

const TrashIcon = createIcon("trash-2", [
  ["path", { d: "M3 6h18", key: "t1" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "t2" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "t3" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "t4" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "t5" }]
]);

const PlusIcon = createIcon("plus", [
  ["path", { d: "M5 12h14", key: "p1" }],
  ["path", { d: "M12 5v14", key: "p2" }]
]);

const MinusIcon = createIcon("minus", [
  ["path", { d: "M5 12h14", key: "m1" }]
]);

const ClockIcon = createIcon("clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "cl1" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "cl2" }]
]);

const ArrowRightIcon = createIcon("arrow-right", [
  ["path", { d: "M5 12h14", key: "ar1" }],
  ["path", { d: "m12 5 7 7-7 7", key: "ar2" }]
]);

const ArrowLeftIcon = createIcon("arrow-left", [
  ["path", { d: "M19 12H5", key: "al1" }],
  ["path", { d: "m12 19-7-7 7-7", key: "al2" }]
]);

const UserCheckIcon = createIcon("user-check", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "uc1" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "uc2" }],
  ["polyline", { points: "16 11 18 13 22 9", key: "uc3" }]
]);

function CartPage() {
  const [cartItems, setCartItems] = React.useState(() => getCart());
  const [currentUser, setCurrentUser] = React.useState(() => getCurrentUser());

  // Step state: "cart" | "details" | "payment" | "verification"
  const [step, setStep] = React.useState(() => {
    if (typeof window !== "undefined") {
      const s = new URLSearchParams(window.location.search).get("step");
      if (s === "details" || s === "payment") return s;
    }
    return "cart";
  });

  // Customer Form fields
  const [fullName, setFullName] = React.useState(() => currentUser?.name || "");
  const [email, setEmail] = React.useState(() => currentUser?.email || "");
  const [whatsapp, setWhatsapp] = React.useState(() => currentUser?.phone || "");
  const [notes, setNotes] = React.useState("");

  // Payment Form fields
  const [utrNumber, setUtrNumber] = React.useState("");
  const [copiedUpi, setCopiedUpi] = React.useState(false);
  const [submittedOrder, setSubmittedOrder] = React.useState(null);

  // Sync state with URL step param
  const navigateToStep = (newStep) => {
    setStep(newStep);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newStep === "cart") {
        url.searchParams.delete("step");
      } else {
        url.searchParams.set("step", newStep);
      }
      window.history.pushState({ step: newStep }, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = (e) => {
      const s = new URLSearchParams(window.location.search).get("step");
      setStep(s === "details" || s === "payment" ? s : "cart");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync Cart & Auth
  React.useEffect(() => {
    // If URL has ?category=XYZ and not in cart yet, add it
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        const found = allServices.find(s => s.name.toLowerCase() === cat.toLowerCase());
        if (found) {
          const current = getCart();
          if (!current.some(it => it.name.toLowerCase() === found.name.toLowerCase())) {
            addToCart({ name: found.name, price: getPrice(found.name), tagline: found.tagline, id: found.id });
          }
        }
      }
    }

    const updateCart = () => setCartItems(getCart());
    const updateAuth = () => {
      const u = getCurrentUser();
      setCurrentUser(u);
      if (u) {
        setFullName(prev => prev || u.name || "");
        setEmail(prev => prev || u.email || "");
        setWhatsapp(prev => prev || u.phone || "");
      }
    };

    window.addEventListener("socialpeak_cart_updated", updateCart);
    window.addEventListener("socialpeak_auth_changed", updateAuth);
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("socialpeak_cart_updated", updateCart);
      window.removeEventListener("socialpeak_auth_changed", updateAuth);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const totalAmount = React.useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)), 0);
  }, [cartItems]);

  const qrUrl = React.useMemo(() => {
    const itemNames = cartItems.map(i => i.name).join(", ");
    return getQrCodeUrl(itemNames || "Activation Order", Math.max(1, totalAmount));
  }, [cartItems, totalAmount]);

  const handleQuantity = (name, delta) => {
    updateCartQuantity(name, delta);
  };

  const handleRemove = (name) => {
    removeFromCart(name);
  };

  const handleCopyUpi = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("arpiiit07@ibl");
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Textarea expands with content, manual resize strictly disabled
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.max(68, e.target.scrollHeight)}px`;
  };

  // Advance from Step 2 (Details) to Step 3 (Payment)
  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("Please enter your Full Name for activation.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid Email Address for activation.");
      return;
    }
    navigateToStep("payment");
  };

  // Submit Order on Step 3 (Payment)
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      alert("Please enter your 12-digit UPI UTR / Transaction Reference ID from payment.");
      return;
    }

    const order = createOrder({
      customerName: fullName.trim(),
      email: email.trim(),
      phone: whatsapp.trim(),
      items: cartItems,
      total: totalAmount,
      utr: cleanUtr,
      notes: notes.trim()
    });

    // Clear cart immediately upon order submission
    clearCart();
    setSubmittedOrder(order);
    setStep("verification");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return jsx(SiteChrome, {
    children: jsxs("div", {
      className: "animate-fade-in max-w-2xl mx-auto py-2 sm:py-6 px-3 sm:px-4",
      children: [
        // ================= PROGRESS STEP BREADCRUMB =================
        step !== "verification" && jsxs("div", {
          className: "mb-6 flex items-center justify-between border-b border-border/80 pb-3.5 text-xs font-semibold",
          children: [
            jsxs("button", {
              type: "button",
              onClick: () => navigateToStep("cart"),
              className: `flex items-center gap-1.5 transition cursor-pointer ${
                step === "cart" ? "text-olive font-bold" : "text-muted-foreground hover:text-foreground"
              }`,
              children: [
                jsx("span", {
                  className: `flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    step === "cart" ? "bg-olive text-white" : "bg-secondary text-muted-foreground"
                  }`,
                  children: "1"
                }),
                "Cart"
              ]
            }),
            jsx("span", { className: "text-border", children: "—" }),
            jsxs("button", {
              type: "button",
              onClick: () => {
                if (cartItems.length > 0) navigateToStep("details");
              },
              disabled: cartItems.length === 0,
              className: `flex items-center gap-1.5 transition ${
                step === "details" ? "text-olive font-bold" : "text-muted-foreground"
              } ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-foreground"}`,
              children: [
                jsx("span", {
                  className: `flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    step === "details" ? "bg-olive text-white" : "bg-secondary text-muted-foreground"
                  }`,
                  children: "2"
                }),
                "Your Details"
              ]
            }),
            jsx("span", { className: "text-border", children: "—" }),
            jsxs("button", {
              type: "button",
              onClick: () => {
                if (cartItems.length > 0 && fullName.trim() && email.trim()) navigateToStep("payment");
              },
              disabled: cartItems.length === 0 || !fullName.trim() || !email.trim(),
              className: `flex items-center gap-1.5 transition ${
                step === "payment" ? "text-olive font-bold" : "text-muted-foreground"
              } ${cartItems.length === 0 || !fullName.trim() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-foreground"}`,
              children: [
                jsx("span", {
                  className: `flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    step === "payment" ? "bg-olive text-white" : "bg-secondary text-muted-foreground"
                  }`,
                  children: "3"
                }),
                "Payment"
              ]
            })
          ]
        }),

        // ================= STEP 4: VERIFICATION SENT (SUCCESS) =================
        step === "verification" && submittedOrder ? (
          jsxs("div", {
            className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm text-center animate-fade-up space-y-6",
            children: [
              jsxs("div", {
                className: "mx-auto h-16 w-16 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0",
                children: [jsx(CheckIcon, { className: "h-8 w-8 stroke-[2.5]" })]
              }),

              jsxs("div", {
                children: [
                  jsx("span", {
                    className: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-700 px-3 py-1 text-xs font-bold mb-2",
                    children: [jsx(ClockIcon, { className: "h-3.5 w-3.5" }), "Order Status: Pending Verification"]
                  }),
                  jsx("h1", {
                    className: "font-display text-2xl sm:text-3xl mt-1 text-foreground",
                    children: "Order Submitted for Verification!"
                  }),
                  jsxs("p", {
                    className: "text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed",
                    children: [
                      "Thank you, ",
                      jsx("strong", { className: "text-foreground", children: submittedOrder.customerName }),
                      "! We received your payment verification for Order ",
                      jsx("strong", { className: "text-foreground font-mono", children: submittedOrder.id }),
                      ". Our team will verify your UTR and activate your product within 15-30 minutes."
                    ]
                  })
                ]
              }),

              // Order Summary Card
              jsxs("div", {
                className: "rounded-xl border border-border bg-secondary/40 p-4 text-left text-xs space-y-2.5",
                children: [
                  jsxs("div", {
                    className: "flex justify-between items-center pb-2 border-b border-border/80",
                    children: [
                      jsx("span", { className: "text-muted-foreground", children: "Order ID" }),
                      jsx("span", { className: "font-mono font-bold text-foreground", children: submittedOrder.id })
                    ]
                  }),
                  jsxs("div", {
                    className: "flex justify-between items-center pb-2 border-b border-border/80",
                    children: [
                      jsx("span", { className: "text-muted-foreground", children: "Registered Email" }),
                      jsx("span", { className: "font-medium text-foreground", children: submittedOrder.email })
                    ]
                  }),
                  jsxs("div", {
                    className: "flex justify-between items-center pb-2 border-b border-border/80",
                    children: [
                      jsx("span", { className: "text-muted-foreground", children: "Payment UTR" }),
                      jsx("span", { className: "font-mono font-semibold text-foreground", children: submittedOrder.utr })
                    ]
                  }),
                  jsxs("div", {
                    className: "flex justify-between items-center pt-1 font-bold text-sm",
                    children: [
                      jsx("span", { children: "Total Paid" }),
                      jsx("span", { className: "text-olive font-display text-lg", children: `₹${submittedOrder.total}` })
                    ]
                  })
                ]
              }),

              // WhatsApp Notification Button (Requested by User)
              jsxs("div", {
                className: "pt-2 space-y-3",
                children: [
                  jsx("a", {
                    href: `https://wa.me/919250806417?text=${encodeURIComponent(
                      `Hi Socialpeak.store, I submitted an order for ${submittedOrder.items.map(i => i.name).join(", ")} with Order ID: ${submittedOrder.id}. Name: ${submittedOrder.customerName}, Email: ${submittedOrder.email}, WhatsApp: ${submittedOrder.phone || "N/A"}. Payment submitted: ₹${submittedOrder.total}, UTR: ${submittedOrder.utr}. Please verify my payment and activate my product.`
                    )}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3.5 px-6 font-bold text-sm hover:opacity-95 shadow-md transition cursor-pointer",
                    children: [
                      jsx(MessageCircleIcon, { className: "h-5 w-5" }),
                      "Notify via WhatsApp"
                    ]
                  }),
                  jsx(Link, {
                    to: "/account",
                    className: "w-full inline-flex items-center justify-center rounded-full border border-border bg-background py-3 px-6 font-semibold text-sm hover:bg-accent transition cursor-pointer",
                    children: "View My Orders in Account →"
                  })
                ]
              })
            ]
          })
        ) : null,

        // ================= STEP 1: CART (ONLY ORDER DETAILS & CHECKOUT BUTTON) =================
        step === "cart" ? (
          cartItems.length === 0 ? (
            // Empty Cart Card
            jsxs("div", {
              className: "rounded-2xl border border-border bg-card shadow-sm empty-cart-card animate-fade-up",
              children: [
                jsxs("div", {
                  className: "mx-auto h-20 w-20 rounded-full bg-olive/10 text-olive flex items-center justify-center shrink-0",
                  children: [jsx(ShoppingBagIcon, { className: "h-10 w-10 stroke-[1.5]" })]
                }),
                jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    jsx("h2", { className: "font-display text-2xl text-foreground", children: "Your cart is empty" }),
                    jsx("p", {
                      className: "text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed",
                      children: "You haven't added any premium activation services to your cart yet."
                    })
                  ]
                }),
                jsx(Link, {
                  to: "/services",
                  className: "empty-cart-btn bg-primary text-primary-foreground hover:opacity-90 transition cursor-pointer",
                  children: "Browse All Products & Plans →"
                })
              ]
            })
          ) : (
            // Cart Items & Proceed Button Only
            jsxs("div", {
              className: "space-y-6 animate-fade-in",
              children: [
                // Header
                jsxs("div", {
                  className: "text-center mb-4",
                  children: [
                    jsx("h1", { className: "store-heading text-3xl sm:text-4xl", children: "Your Cart" }),
                    jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Review your selected services before checkout." })
                  ]
                }),

                // Items list card
                jsxs("div", {
                  className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4",
                  children: [
                    jsxs("div", {
                      className: "flex items-center justify-between pb-3 border-b border-border",
                      children: [
                        jsxs("h2", {
                          className: "font-display text-lg sm:text-xl flex items-center gap-2",
                          children: [
                            jsx(ShoppingBagIcon, { className: "h-5 w-5 text-olive" }),
                            "Order Details",
                            jsx("span", {
                              className: "ml-1 rounded-full bg-olive/15 px-2.5 py-0.5 text-xs font-mono font-bold text-olive",
                              children: `${cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)} items`
                            })
                          ]
                        }),
                        jsx("button", {
                          onClick: clearCart,
                          className: "text-xs text-muted-foreground hover:text-destructive transition cursor-pointer",
                          children: "Clear All"
                        })
                      ]
                    }),

                    // Items loop
                    jsxs("div", {
                      className: "divide-y divide-border/60",
                      children: cartItems.map((item) => (
                        jsxs("div", {
                          key: item.name,
                          className: "py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                          children: [
                            // Product info
                            jsxs("div", {
                              className: "flex items-center gap-3 flex-1 min-w-0",
                              children: [
                                jsx("div", {
                                  className: "h-11 w-11 shrink-0 rounded-lg border border-border bg-background p-1.5 flex items-center justify-center overflow-hidden",
                                  children: jsx("img", {
                                    src: item.image || getProductImage(item),
                                    alt: item.name,
                                    className: "h-full w-full object-contain",
                                    onError: (e) => { e.target.style.display = 'none'; }
                                  })
                                }),
                                jsxs("div", {
                                  className: "min-w-0 flex-1",
                                  children: [
                                    jsx("h3", {
                                      className: "font-semibold text-sm sm:text-base text-foreground truncate",
                                      children: item.name
                                    }),
                                    item.tagline && jsx("p", {
                                      className: "text-xs text-muted-foreground truncate mt-0.5",
                                      children: item.tagline
                                    }),
                                    jsxs("p", {
                                      className: "text-xs font-mono text-olive font-semibold mt-1",
                                      children: [`₹${item.price}`, jsx("span", { className: "text-muted-foreground font-normal", children: " / plan" })]
                                    })
                                  ]
                                })
                              ]
                            }),

                            // Quantity controls & Remove
                            jsxs("div", {
                              className: "flex items-center justify-between sm:justify-end gap-3 shrink-0",
                              children: [
                                jsxs("div", {
                                  className: "inline-flex items-center rounded-lg border border-border bg-background p-1 gap-1",
                                  children: [
                                    jsx("button", {
                                      type: "button",
                                      onClick: () => handleQuantity(item.name, -1),
                                      className: "h-7 w-7 rounded flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer",
                                      "aria-label": "Decrease quantity",
                                      children: jsx(MinusIcon, { className: "h-3.5 w-3.5" })
                                    }),
                                    jsx("span", {
                                      className: "w-8 text-center font-mono font-bold text-xs text-foreground",
                                      children: item.quantity || 1
                                    }),
                                    jsx("button", {
                                      type: "button",
                                      onClick: () => handleQuantity(item.name, 1),
                                      className: "h-7 w-7 rounded flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer",
                                      "aria-label": "Increase quantity",
                                      children: jsx(PlusIcon, { className: "h-3.5 w-3.5" })
                                    })
                                  ]
                                }),
                                jsx("span", {
                                  className: "font-display text-base font-bold text-foreground min-w-[70px] text-right",
                                  children: `₹${Number(item.price) * (item.quantity || 1)}`
                                }),
                                jsx("button", {
                                  type: "button",
                                  onClick: () => handleRemove(item.name),
                                  className: "h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer",
                                  title: "Remove item",
                                  "aria-label": "Remove item",
                                  children: jsx(TrashIcon, { className: "h-4 w-4" })
                                })
                              ]
                            })
                          ]
                        }, item.name)
                      ))
                    }),

                    // Subtotal and Total
                    jsxs("div", {
                      className: "pt-4 border-t border-border space-y-2",
                      children: [
                        jsxs("div", {
                          className: "flex justify-between text-xs text-muted-foreground",
                          children: [
                            jsx("span", { children: "Activation / Service Fee" }),
                            jsx("span", { className: "text-olive font-semibold", children: "FREE" })
                          ]
                        }),
                        jsxs("div", {
                          className: "flex justify-between items-center pt-2 border-t border-border/80 text-base font-bold",
                          children: [
                            jsx("span", { children: "Total Amount" }),
                            jsxs("span", {
                              className: "font-display text-2xl text-olive",
                              children: ["₹", totalAmount.toLocaleString("en-IN")]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Prominent Proceed to Checkout Button (As requested: ONLY details and checkout button)
                jsxs("div", {
                  className: "space-y-3 pt-2",
                  children: [
                    jsxs("button", {
                      type: "button",
                      onClick: () => navigateToStep("details"),
                      className: "w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 text-base font-bold hover:opacity-95 shadow-md transition cursor-pointer",
                      children: [
                        "Proceed to Checkout",
                        jsx(ArrowRightIcon, { className: "h-5 w-5" })
                      ]
                    }),
                    jsx("div", {
                      className: "text-center",
                      children: jsx(Link, {
                        to: "/services",
                        className: "text-xs text-muted-foreground hover:text-olive transition inline-flex items-center gap-1",
                        children: "← Continue Shopping / Add more plans"
                      })
                    })
                  ]
                })
              ]
            })
          )
        ) : null,

        // ================= STEP 2: USER DETAILS =================
        step === "details" && cartItems.length > 0 ? (
          jsxs("div", {
            className: "space-y-6 animate-fade-in",
            children: [
              // Header
              jsxs("div", {
                className: "text-center mb-2",
                children: [
                  jsx("h1", { className: "store-heading text-3xl sm:text-4xl", children: "Customer Details" }),
                  jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Provide your contact information for product activation." })
                ]
              }),

              // Mini Order Total Pill
              jsxs("div", {
                className: "flex items-center justify-between rounded-xl bg-secondary/50 border border-border px-4 py-2.5 text-xs",
                children: [
                  jsxs("span", {
                    className: "text-muted-foreground",
                    children: ["Order Total (", cartItems.length, " items):"]
                  }),
                  jsx("span", {
                    className: "font-display font-bold text-olive text-sm",
                    children: `₹${totalAmount.toLocaleString("en-IN")}`
                  })
                ]
              }),

              // User Info Form Card
              jsxs("form", {
                onSubmit: handleContinueToPayment,
                className: "rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm space-y-5",
                children: [
                  // Name Field
                  jsxs("div", {
                    children: [
                      jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Full Name *" }),
                      jsx("input", {
                        type: "text",
                        required: true,
                        placeholder: "Enter your full name",
                        value: fullName,
                        onChange: e => setFullName(e.target.value),
                        className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                      })
                    ]
                  }),

                  // Email Field
                  jsxs("div", {
                    children: [
                      jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Email Address (for Activation) *" }),
                      jsx("input", {
                        type: "email",
                        required: true,
                        placeholder: "name@example.com",
                        value: email,
                        onChange: e => setEmail(e.target.value),
                        className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                      }),
                      jsx("p", {
                        className: "text-[11px] text-muted-foreground mt-1",
                        children: "We send the invite / login credentials to this email address."
                      })
                    ]
                  }),

                  // WhatsApp Number
                  jsxs("div", {
                    children: [
                      jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "WhatsApp Phone Number (Optional)" }),
                      jsx("input", {
                        type: "tel",
                        placeholder: "e.g. +91 98765 43210",
                        value: whatsapp,
                        onChange: e => setWhatsapp(e.target.value),
                        className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                      }),
                      jsx("p", {
                        className: "text-[11px] text-muted-foreground mt-1",
                        children: "For instant coordination and activation confirmation on WhatsApp."
                      })
                    ]
                  }),

                  // Order Notes (Fixed: Manual resize strictly disabled, auto-expands with content)
                  jsxs("div", {
                    children: [
                      jsx("label", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "Order Notes (Optional)" }),
                      jsx("textarea", {
                        rows: 2,
                        value: notes,
                        onChange: handleNotesChange,
                        placeholder: "Any special instructions or preferred language / region...",
                        className: "sp-notes-input w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-olive/40 focus:outline-none transition",
                        style: { resize: "none", overflowY: "hidden" }
                      })
                    ]
                  }),

                  // Navigation buttons: Back to Cart + Continue to Payment
                  jsxs("div", {
                    className: "pt-3 flex flex-col sm:flex-row gap-3",
                    children: [
                      jsxs("button", {
                        type: "button",
                        onClick: () => navigateToStep("cart"),
                        className: "inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background py-3 px-6 text-sm font-semibold hover:bg-secondary transition cursor-pointer order-2 sm:order-1",
                        children: [
                          jsx(ArrowLeftIcon, { className: "h-4 w-4" }),
                          "Back to Cart"
                        ]
                      }),
                      jsxs("button", {
                        type: "submit",
                        className: "flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 px-6 text-sm font-bold hover:opacity-95 shadow transition cursor-pointer order-1 sm:order-2",
                        children: [
                          "Continue to Payment",
                          jsx(ArrowRightIcon, { className: "h-4 w-4" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ) : null,

        // ================= STEP 3: PAYMENT & VERIFICATION =================
        step === "payment" && cartItems.length > 0 ? (
          jsxs("div", {
            className: "space-y-6 animate-fade-in",
            children: [
              // Header
              jsxs("div", {
                className: "text-center mb-2",
                children: [
                  jsx("h1", { className: "store-heading text-3xl sm:text-4xl", children: "Payment & Verification" }),
                  jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Scan QR code or use UPI ID, then submit your UTR." })
                ]
              }),

              // Payment Form Card
              jsxs("form", {
                onSubmit: handleSubmitOrder,
                className: "rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm space-y-6",
                children: [
                  // Dynamic UPI QR Code
                  jsxs("div", {
                    className: "flex flex-col items-center text-center space-y-3",
                    children: [
                      jsxs("div", {
                        className: "rounded-2xl border border-border bg-white p-3 shadow-sm",
                        children: [
                          jsx("img", {
                            src: qrUrl,
                            alt: "Scan UPI QR Code to pay",
                            width: 220,
                            height: 220,
                            className: "h-52 w-52 sm:h-56 sm:w-56 object-contain"
                          })
                        ]
                      }),
                      jsxs("p", {
                        className: "text-xs font-semibold text-foreground",
                        children: ["Scan via GPay, PhonePe, Paytm, or CRED to pay ", jsx("span", { className: "text-olive font-bold", children: `₹${totalAmount}` })]
                      }),

                      // UPI ID Copy Row
                      jsxs("div", {
                        className: "inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs shadow-xs",
                        children: [
                          jsx("span", { className: "text-muted-foreground", children: "UPI ID:" }),
                          jsx("code", { className: "font-mono font-bold text-foreground", children: "arpiiit07@ibl" }),
                          jsxs("button", {
                            type: "button",
                            onClick: handleCopyUpi,
                            className: "ml-1 inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground hover:bg-olive hover:text-white transition cursor-pointer",
                            children: [
                              copiedUpi ? jsx(CheckIcon, { className: "h-3 w-3" }) : jsx(CopyIcon, { className: "h-3 w-3" }),
                              copiedUpi ? "Copied!" : "Copy"
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  // UTR Input Section
                  jsxs("div", {
                    className: "rounded-xl border border-border bg-background p-4 space-y-2",
                    children: [
                      jsx("label", {
                        htmlFor: "utr-input",
                        className: "block text-xs font-bold text-foreground",
                        children: "12-Digit UPI UTR / Reference ID *"
                      }),
                      jsx("input", {
                        id: "utr-input",
                        type: "text",
                        required: true,
                        maxLength: 24,
                        placeholder: "e.g. 665775182956",
                        value: utrNumber,
                        onChange: e => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, "")),
                        className: "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-mono focus:ring-2 focus:ring-olive/40 focus:outline-none transition"
                      }),
                      jsx("p", {
                        className: "text-[11px] text-muted-foreground leading-relaxed",
                        children: "After completing your UPI payment, copy the 12-digit UTR from your bank or UPI receipt and enter it above."
                      })
                    ]
                  }),

                  // Navigation buttons: Back to Details + Submit for Verification
                  jsxs("div", {
                    className: "pt-2 flex flex-col sm:flex-row gap-3",
                    children: [
                      jsxs("button", {
                        type: "button",
                        onClick: () => navigateToStep("details"),
                        className: "inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background py-3 px-6 text-sm font-semibold hover:bg-secondary transition cursor-pointer order-2 sm:order-1",
                        children: [
                          jsx(ArrowLeftIcon, { className: "h-4 w-4" }),
                          "Back to Details"
                        ]
                      }),
                      jsxs("button", {
                        type: "submit",
                        className: "flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 px-6 text-sm font-bold hover:opacity-95 shadow-md transition cursor-pointer order-1 sm:order-2",
                        children: [
                          jsx(CheckIcon, { className: "h-4 w-4 stroke-[2.5]" }),
                          "Submit Order for Verification"
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ) : null
      ]
    })
  });
}

export { CartPage as component };