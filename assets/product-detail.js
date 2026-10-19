import { l as getReact, s as getReactCore, o as getJsx } from "./useSelector-C0pj3Bsi.js";
import { r as Link, i as useNavigate } from "./client-DPgd7H-W.js";
import { a as ZapIcon, c as createIcon, n as Button, t as SiteChrome } from "./SiteChrome-BCifFRZP.js";
import { addToCart, getProducts, getProductImage } from "./store.js";
import { t as allServices } from "./services-DmmZwhxf.js";
import { t as allCategories, i as getCategoryArt, n as getBrand, r as getCustomArt } from "./catalog-Bsm4ayw2.js";

const React = getReact(getReactCore());
const { jsx, jsxs } = getJsx();

// Icons
const ArrowLeftIcon = createIcon("arrow-left", [
  ["path", { d: "m12 19-7-7 7-7", key: "al1" }],
  ["path", { d: "M19 12H5", key: "al2" }]
]);

const CheckCircleIcon = createIcon("check-circle-2", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "cc1" }],
  ["path", { d: "m9 12 2 2 4-4", key: "cc2" }]
]);

const ShoppingBagIcon = createIcon("shopping-bag", [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "sb1" }],
  ["path", { d: "M3.103 6.034h17.794", key: "sb2" }],
  ["path", { d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z", key: "sb3" }]
]);

const ShieldCheckIcon = createIcon("shield-check", [
  ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", key: "sc1" }],
  ["path", { d: "m9 12 2 2 4-4", key: "sc2" }]
]);

const ClockIcon = createIcon("clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "cl1" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "cl2" }]
]);

const MessageCircleIcon = createIcon("message-circle", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "mc1" }]
]);

const PlusIcon = createIcon("plus", [
  ["path", { d: "M5 12h14", key: "p1" }],
  ["path", { d: "M12 5v14", key: "p2" }]
]);

const MinusIcon = createIcon("minus", [
  ["path", { d: "M5 12h14", key: "m1" }]
]);

// Rich descriptive details dictionary for all known products
const PRODUCT_DESCRIPTIONS = {
  "netflix": {
    desc: "Official Netflix Premium plan with Ultra HD 4K streaming and HDR. Enjoy thousands of award-winning movies, TV shows, documentaries, and anime. Compatible with Smart TVs, Android/iOS smartphones, laptops, and tablets. Verified activation on shared screen.",
    features: ["4K Ultra HD & HDR Streaming", "Compatible with TV, Phone & PC", "Ad-Free Streaming Experience", "Verified Official Activation"]
  },
  "netflix-warranty": {
    desc: "Netflix Premium 1 Month with 100% full replacement warranty. Stream Ultra HD 4K content on your own private profile with custom PIN lock. If any access interruption occurs during the 30-day period, instant replacement or fix is provided via WhatsApp support.",
    features: ["Private Profile with PIN Lock", "100% Full Month Replacement Warranty", "4K Ultra HD & Spatial Audio", "Direct VIP WhatsApp Assistance"]
  },
  "youtube": {
    desc: "YouTube Premium activated directly on your personal Gmail address. Enjoy 100% ad-free videos, background play while using other apps, offline video downloads, and unlimited access to YouTube Music Premium.",
    features: ["Activated on Your Personal Gmail", "100% Ad-Free Video Streaming", "Background Play & Offline Downloads", "Includes Full YouTube Music Premium"]
  },
  "spotify": {
    desc: "Spotify Premium 3 Months subscription for ad-free music streaming, unlimited skips, offline song downloads, and high-fidelity lossless audio. Activated on your own account or ready-to-use premium credentials.",
    features: ["3 Months Uninterrupted Music", "Ad-Free & Unlimited Skips", "Download Songs for Offline Listening", "High Quality Audio Streaming"]
  },
  "apple-music": {
    desc: "Apple Music Premium 6 Months subscription featuring over 100 million songs in Lossless Audio and Spatial Audio with Dolby Atmos. Access full music catalog on iPhone, iPad, Mac, Android, and PC.",
    features: ["6 Months Full Catalogue Access", "Spatial Audio with Dolby Atmos", "Lossless Audio Quality", "Works on iOS, Android & Windows"]
  },
  "adobe": {
    desc: "Adobe Creative Cloud full suite subscription giving you complete access to Photoshop, Illustrator, Premiere Pro, After Effects, InDesign, Lightroom, and 20+ desktop & mobile creative apps.",
    features: ["Full Creative Cloud App Suite", "Photoshop, Premiere & Illustrator Included", "Genuine Cloud Sync & Presets", "100% Official License"]
  },
  "gemini": {
    desc: "Google Gemini AI Pro subscription access. Experience Google's most capable AI reasoning model for advanced coding, complex writing, multimodal analysis, and deep problem solving.",
    features: ["Gemini 1.5 Pro & Deep Reasoning", "Multimodal Image & Document Analysis", "High Context Window", "Instant Activation Link"]
  },
  "jiohotstar": {
    desc: "JioHotstar Premium plan activated directly on your phone number. Stream live sports (Cricket, Football), exclusive Indian and international movies, Disney+ originals, and blockbuster web series in 4K resolution.",
    features: ["Activated on Your Own Number", "Live Sports & 4K Streaming", "Disney+, HBO & Exclusive Originals", "Multi-Device Login Support"]
  },
  "canva": {
    desc: "Canva Pro 1 Year complete access activated directly on your personal email. Unlock 100+ million premium stock photos, graphics, videos, Brand Kit, Magic Studio AI tools, and 1TB cloud storage.",
    features: ["Full 1-Year Pro Activation on Your Email", "100M+ Premium Photos & Graphics", "Magic AI Tools & Background Remover", "Brand Kit & Cloud Storage Included"]
  },
  "chatgpt-shared": {
    desc: "ChatGPT Plus / Shared premium account with access to GPT-4o, DALL·E 3 image generation, advanced data analysis, custom GPTs, and web browsing capabilities.",
    features: ["Access to GPT-4o & Advanced Models", "DALL·E 3 High-Quality Image Generation", "Advanced Data Analysis & Coding", "Fast Response Speed"]
  },
  "duolingo": {
    desc: "Super Duolingo 1 Year plan. Master any language with unlimited hearts, practice hubs, zero ad interruptions, personalized mistakes review, and progress quizzes.",
    features: ["1 Full Year of Super Duolingo", "Unlimited Hearts & Ad-Free Learning", "Personalized Practice Hub", "Activated on Your Own Email"]
  },
  "linkedin": {
    desc: "LinkedIn Premium Business / Career 3 Months subscription. Enjoy InMail credits, see who viewed your profile, access 16,000+ LinkedIn Learning courses, and competitive applicant insights.",
    features: ["3 Months Premium Career / Business", "Direct InMail Messaging Credits", "Full 'Who Viewed Your Profile' Insights", "Free LinkedIn Learning Courses Access"]
  },
  "amazon-prime-screen": {
    desc: "Amazon Prime Video per screen access. Stream Prime Video original series, Bollywood & Hollywood blockbusters in 4K HDR. Fast login credentials delivery.",
    features: ["4K HDR Prime Video Streaming", "Smart TV & Mobile Compatible", "Popular Web Series & Movies", "Instant Login Access"]
  },
  "amazon-prime-private": {
    desc: "Amazon Prime 1 Month Full Private Account. Complete control over all profiles with full Prime Video streaming, Amazon Music, and fast shopping delivery perks.",
    features: ["Full Private Account with Your Own Password", "100% Private Profiles & Watch History", "Prime Video & Amazon Music", "Full 30-Day Warranty"]
  },
  "amazon-prime-shared-6m": {
    desc: "Amazon Prime 6 Months Shared Screen subscription. Long-term streaming access for movies and top-rated web series at an unbeatable price.",
    features: ["6 Months Long-Term Validity", "High-Definition 1080p / 4K Streaming", "Works on Smart TV & Phone", "Cost-Effective Entertainment"]
  },
  "amazon-prime-private-6m": {
    desc: "Amazon Prime 6 Months Full Private Account. 6 months uninterrupted access on your private account with complete privacy and full warranty.",
    features: ["6 Months Private Account Access", "Full Account Ownership & Profiles", "Ad-Free Streaming & Prime Music", "6-Month Full Support Warranty"]
  },
  "crunchyroll-month": {
    desc: "Crunchyroll Premium 1 Month subscription. Watch Demon Slayer, Jujutsu Kaisen, One Piece, Attack on Titan, and thousands of top anime titles ad-free in HD.",
    features: ["100% Ad-Free Anime Streaming", "Simulcast Episodes 1 Hour After Japan", "Offline Viewing on Mobile", "Full English Dubs & Subs"]
  },
  "crunchyroll-link": {
    desc: "Crunchyroll Mega Fan Redeem Link. Stream the world's largest anime library with simulcasts direct from Japan, ad-free streaming, and offline viewing.",
    features: ["Official Mega Fan Redeem Link", "Redeem Directly on Your Own Account", "Ad-Free HD Anime Streaming", "Multiple Offline Downloads"]
  },
  "whatsapp-number": {
    desc: "Virtual number for WhatsApp verification. Clean, private, and verified number delivered instantly with OTP code to set up a secondary or business WhatsApp account.",
    features: ["Instant OTP Delivery via WhatsApp", "Fresh Unused Number", "Compatible with WhatsApp & WA Business", "Quick 5-Minute Setup"]
  },
  "otp-panel-whatsapp": {
    desc: "WhatsApp OTP Panel access. Full self-service panel to generate OTPs and activate numbers for multiple apps and services on demand.",
    features: ["Self-Service OTP Generation Panel", "Instant Delivery & Balance Access", "Supports WhatsApp & Other Popular Apps", "Admin Access Credentials Provided"]
  },
  "debit-card": {
    desc: "Virtual Debit Card for online international payments, subscription trials, and app activations. Pre-configured for easy digital transactions.",
    features: ["International Online Payment Ready", "Card Number, Expiry & CVV Provided", "Ideal for Digital Trials & Subscriptions", "Instant WhatsApp Handover"]
  },
  "other": {
    desc: "Custom activation request for any premium tool, app, or subscription not explicitly listed. Tell us your requirements in the order notes and we will fulfill it.",
    features: ["Any Custom Tool or Subscription", "Tailored Pricing & Setup", "Direct WhatsApp Coordination", "Guaranteed Safe & Verified Access"]
  }
};

function ProductDetailPage() {
  const navigate = useNavigate();

  // Search parameters from URL (?id=... or ?name=...)
  const queryParams = React.useMemo(() => {
    if (typeof window === "undefined") return { id: "", name: "" };
    const sp = new URLSearchParams(window.location.search);
    return {
      id: sp.get("id") || "",
      name: sp.get("name") || ""
    };
  }, []);

  const [productsList, setProductsList] = React.useState(() => getProducts());

  React.useEffect(() => {
    const sync = () => setProductsList(getProducts());
    window.addEventListener("socialpeak_products_updated", sync);
    return () => window.removeEventListener("socialpeak_products_updated", sync);
  }, []);

  // Find the requested product
  const product = React.useMemo(() => {
    const id = (queryParams.id || "").toLowerCase().trim();
    const name = (queryParams.name || "").toLowerCase().trim();

    if (id) {
      const found = productsList.find(p => p.id === id || p.id.toLowerCase() === id);
      if (found) return found;
    }
    if (name) {
      const found = productsList.find(p => p.name.toLowerCase() === name);
      if (found) return found;
    }
    // Default fallback to first product or null if catalog empty
    return productsList[0] || null;
  }, [queryParams, productsList]);

  const [quantity, setQuantity] = React.useState(1);
  const [addedToast, setAddedToast] = React.useState(false);

  // Scroll to top on mount or product change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [product]);

  if (!product) {
    return jsx(SiteChrome, {
      children: jsxs("div", {
        className: "py-16 text-center max-w-md mx-auto space-y-4",
        children: [
          jsx("h2", { className: "text-2xl font-display", children: "Product Not Found" }),
          jsx("p", { className: "text-muted-foreground text-sm", children: "The service you are looking for is currently unavailable." }),
          jsx(Link, {
            to: "/services",
            className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-olive text-black font-semibold text-sm",
            children: "Browse All Products"
          })
        ]
      })
    });
  }

  // Get image, custom art and category metadata
  const customArt = getCustomArt(product.id);
  const prodImg = product.image || customArt || getCategoryArt(product.id) || getProductImage(product);
  const brandClass = getBrand(product.id);

  // Lookup custom or fallback description
  const meta = PRODUCT_DESCRIPTIONS[product.id] || {
    desc: product.description || `${product.name} premium digital activation. Fast delivery and activation directly via WhatsApp support.`
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    try {
      if (navigate) {
        navigate({ to: "/cart" });
        return;
      }
    } catch (e) {}
    if (typeof window !== "undefined") {
      window.location.href = "/cart";
    }
  };

  // WhatsApp Pre-filled URL
  const waHelpUrl = `https://wa.me/919250806417?text=${encodeURIComponent(
    `Hi Socialpeak.store, I have a question about ${product.name} (Price: ₹${product.price}). Please assist me.`
  )}`;

  // Related products from other items
  const relatedProducts = productsList.filter(p => p.id !== product.id).slice(0, 4);

  return jsx(SiteChrome, {
    children: jsxs("div", {
      className: "animate-fade-in max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-6 sm:space-y-8",
      children: [
        // Top Breadcrumb & Navigation
        jsx("div", {
          className: "flex items-center text-xs sm:text-sm py-1",
          children: jsxs(Link, {
            to: "/services",
            className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-olive transition font-medium cursor-pointer",
            children: [
              jsx(ArrowLeftIcon, { className: "h-4 w-4" }),
              "Back to all products"
            ]
          })
        }),

        // Main Product Detail Grid
        jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-start",
          children: [
            // Left Column: Product Brand Image (5 cols)
            jsx("div", {
              className: "md:col-span-5 flex justify-center",
              children: jsx("div", {
                className: "product-art product-detail-art relative rounded-2xl shadow-sm overflow-hidden w-full",
                "data-brand": brandClass,
                children: jsx("img", {
                  src: prodImg,
                  alt: product.name,
                  loading: "eager",
                  className: customArt ? "" : "product-photo"
                })
              })
            }),

            // Right Column: Product Info, Price, Description, Actions (7 cols)
            jsxs("div", {
              className: "md:col-span-7 space-y-4 sm:space-y-5",
              children: [
                // Title & Category
                jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    jsx("span", {
                      className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-olive/10 text-olive text-[11px] font-semibold uppercase tracking-wider",
                      children: product.category || "Premium Plan"
                    }),
                    jsx("h1", {
                      className: "font-display text-xl sm:text-3xl text-foreground leading-snug",
                      children: product.name
                    }),
                    product.tagline && jsx("p", {
                      className: "text-xs sm:text-sm text-muted-foreground",
                      children: product.tagline
                    })
                  ]
                }),

                // Price Section (with / plan and strikethrough original price if discounted)
                (() => {
                  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
                  const discountPercent = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100) : 0;
                  return jsxs("div", {
                    className: "flex items-baseline flex-wrap gap-2 pb-3 border-b border-border",
                    children: [
                      hasDiscount && jsxs("del", {
                        className: "text-muted-foreground line-through text-base sm:text-xl font-normal mr-1",
                        children: ["₹", Number(product.originalPrice).toLocaleString("en-IN")]
                      }),
                      jsxs("span", {
                        className: "font-display text-2xl sm:text-3xl text-foreground font-bold",
                        children: ["₹", Number(product.price).toLocaleString("en-IN")]
                      }),
                      jsx("span", {
                        className: "text-xs sm:text-sm text-muted-foreground font-medium",
                        children: " / plan"
                      }),
                      hasDiscount && jsxs("span", {
                        className: "ml-auto sm:ml-2 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-olive/15 text-olive",
                        children: [discountPercent, "% OFF"]
                      })
                    ]
                  });
                })(),

                // Detailed Description (Supports custom description from admin)
                jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    jsx("h3", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                      children: "About This Plan"
                    }),
                    jsx("p", {
                      className: "text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line",
                      children: product.description || meta.desc
                    })
                  ]
                }),

                // Quantity & Primary Cart Actions
                jsxs("div", {
                  className: "pt-1 space-y-3",
                  children: [
                    // Quantity Selector
                    jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: "Quantity:" }),
                        jsxs("div", {
                          className: "inline-flex items-center rounded-xl border border-border bg-card p-0.5 shadow-xs",
                          children: [
                            jsx("button", {
                              type: "button",
                              onClick: () => setQuantity(q => Math.max(1, q - 1)),
                              className: "h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer",
                              "aria-label": "Decrease quantity",
                              children: jsx(MinusIcon, { className: "h-3.5 w-3.5" })
                            }),
                            jsx("span", {
                              className: "w-8 text-center font-mono font-bold text-sm",
                              children: quantity
                            }),
                            jsx("button", {
                              type: "button",
                              onClick: () => setQuantity(q => q + 1),
                              className: "h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer",
                              "aria-label": "Increase quantity",
                              children: jsx(PlusIcon, { className: "h-3.5 w-3.5" })
                            })
                          ]
                        })
                      ]
                    }),

                    // Action Buttons (Add to Cart + Buy Now)
                    jsxs("div", {
                      className: "flex flex-col sm:flex-row gap-2.5 pt-1",
                      children: [
                        // Add to Cart Button
                        jsxs("button", {
                          type: "button",
                          onClick: handleAddToCart,
                          className: `flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition cursor-pointer shadow-sm ${
                            addedToast
                              ? "bg-olive text-black scale-95"
                              : "bg-foreground text-card hover:bg-foreground/90"
                          }`,
                          children: [
                            jsx(ShoppingBagIcon, { className: "h-4 w-4" }),
                            addedToast ? "Added to Cart! ✓" : "Add to Cart"
                          ]
                        }),

                        // Buy Now Button
                        jsx("button", {
                          type: "button",
                          onClick: handleBuyNow,
                          className: "flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-olive text-black font-bold text-sm hover:brightness-110 active:scale-95 transition cursor-pointer shadow-md",
                          children: "Buy Now (Checkout)"
                        })
                      ]
                    })
                  ]
                }),

                // ================= ASK ON WHATSAPP OPTION =================
                jsxs("div", {
                  className: "rounded-2xl border border-olive/30 bg-olive/5 px-4 py-4.5 sm:px-5 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-xs mt-5",
                  children: [
                    jsxs("div", {
                      className: "flex items-center gap-3 text-center sm:text-left w-full sm:w-auto",
                      children: [
                        jsx("div", {
                          className: "w-9 h-9 rounded-full bg-olive/20 text-olive flex items-center justify-center shrink-0",
                          children: jsx(MessageCircleIcon, { className: "h-4.5 w-4.5" })
                        }),
                        jsxs("div", {
                          className: "space-y-1",
                          children: [
                            jsx("p", {
                              className: "font-semibold text-sm text-foreground leading-snug",
                              children: "Have questions about this activation?"
                            }),
                            jsx("p", {
                              className: "text-xs text-muted-foreground leading-normal",
                              children: "Direct human WhatsApp assistance & quick answers"
                            })
                          ]
                        })
                      ]
                    }),
                    jsxs("a", {
                      href: waHelpUrl,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-full bg-olive text-black font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition shadow-xs shrink-0 whitespace-nowrap cursor-pointer mt-1 sm:mt-0",
                      children: [
                        jsx(MessageCircleIcon, { className: "h-4 w-4" }),
                        "If any questions, ask on WhatsApp"
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Related / Recommended Services
        relatedProducts.length > 0 && jsxs("section", {
          className: "pt-8 border-t border-border space-y-5",
          children: [
            jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                jsx("h3", { className: "text-xl sm:text-2xl font-display", children: "Explore other popular plans" }),
                jsx(Link, { to: "/services", className: "text-xs sm:text-sm font-medium text-olive hover:underline", children: "View all →" })
              ]
            }),
            jsx("div", {
              className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4",
              children: relatedProducts.map(rel =>
                jsxs(Link, {
                  key: rel.id,
                  to: "/product",
                  search: { id: rel.id, name: rel.name },
                  className: "group rounded-xl border border-border bg-card p-3 sm:p-4 text-center hover:border-olive/60 transition block shadow-xs",
                  children: [
                    jsx("img", {
                      src: rel.image || getProductImage(rel),
                      alt: rel.name,
                      className: "w-14 h-14 sm:w-16 sm:h-16 mx-auto object-contain group-hover:scale-105 transition-transform"
                    }),
                    jsx("h4", { className: "mt-3 text-xs sm:text-sm font-semibold truncate group-hover:text-olive transition", children: rel.name }),
                    jsxs("p", { className: "mt-1 font-display font-bold text-sm sm:text-base text-foreground", children: [`₹`, Number(rel.price).toLocaleString("en-IN")] })
                  ]
                })
              )
            })
          ]
        })
      ]
    })
  });
}

export { ProductDetailPage as component };
