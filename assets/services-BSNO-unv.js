import { l as getReact, s as getReactCore, o as getJsx } from "./useSelector-C0pj3Bsi.js";
import { r as Link } from "./client-DPgd7H-W.js";
import { a as ZapIcon, c as createIcon, n as Button, t as SiteChrome } from "./SiteChrome-BCifFRZP.js";
import { t as allServices } from "./services-DmmZwhxf.js";
import { t as allCategories } from "./catalog-Bsm4ayw2.js";
import { t as ProductCard } from "./ProductCard-Dg4f6_0X.js";
import { t as MessageCircleIcon } from "./message-circle-DujXu9uS.js";
import { getProducts } from "./store.js";

const React = getReact(getReactCore());
const { jsx, jsxs } = getJsx();

const SearchIcon = createIcon("search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "s1" }],
  ["path", { d: "m21 21-4.34-4.34", key: "s2" }]
]);

const XIcon = createIcon("x", [
  ["path", { d: "M18 6 6 18", key: "x1" }],
  ["path", { d: "m6 6 12 12", key: "x2" }]
]);

function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("group") || "all";
    }
    return "all";
  });

  const [searchQuery, setSearchQuery] = React.useState("");

  const [currentProducts, setCurrentProducts] = React.useState(() => {
    return getProducts();
  });

  React.useEffect(() => {
    const sync = () => setCurrentProducts(getProducts());
    window.addEventListener("socialpeak_products_updated", sync);
    return () => window.removeEventListener("socialpeak_products_updated", sync);
  }, []);

  const categoryList = React.useMemo(() => [
    { id: "discount", name: "Discount Deals", emoji: "🏷️" },
    ...allCategories
  ], []);

  const scrollContainerRef = React.useRef(null);
  const isDragging = React.useRef(false);
  const hasMoved = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const filteredServices = React.useMemo(() => {
    const list = currentProducts && currentProducts.length ? currentProducts : allServices;
    return list.filter(service => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "discount") {
          const hasDiscount = (service.originalPrice && Number(service.originalPrice) > Number(service.price)) || service.category === "discount";
          if (!hasDiscount) return false;
        } else {
          const cat = allCategories.find(c => c.id === selectedCategory);
          if (cat && !cat.products?.includes(service.id) && service.category !== selectedCategory) {
            return false;
          }
        }
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesTag = (service.tagline || "").toLowerCase().includes(query);
        return matchesName || matchesTag;
      }
      return true;
    });
  }, [currentProducts, selectedCategory, searchQuery]);

  return jsx(SiteChrome, {
    children: jsxs("div", {
      className: "w-full max-w-full animate-fade-in",
      children: [
        // Header Section
        jsxs("section", {
          className: "text-center py-6 sm:py-10 max-w-full",
          children: [
            jsxs("div", {
              className: "mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs sm:text-sm shadow-sm animate-soft-pulse",
              children: [
                jsx(ZapIcon, { className: "h-3.5 w-3.5 text-olive" }),
                jsx("span", { className: "font-semibold", children: "Catalogue" }),
                jsx("span", { className: "text-muted-foreground", children: "• Official Digital Plans" })
              ]
            }),
            jsxs("h1", {
              className: "store-heading",
              children: [
                "All Services & ",
                jsx("span", { className: "italic text-olive", children: "Plans" })
              ]
            }),
            jsx("p", {
              className: "mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground px-2",
              children: "Browse all premium subscriptions, verified numbers, and accounts. Select any service to book an appointment."
            }),

            // Search Bar with fixed icon positioning and proper padding
            jsxs("div", {
              className: "mx-auto mt-6 max-w-md relative w-full px-1",
              children: [
                jsx(SearchIcon, {
                  className: "absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                }),
                jsx("input", {
                  type: "text",
                  placeholder: "Search Netflix, Spotify, Canva, WhatsApp...",
                  value: searchQuery,
                  onChange: e => setSearchQuery(e.target.value),
                  className: "w-full store-search-input py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 shadow-sm transition box-border"
                }),
                searchQuery ? jsx("button", {
                  onClick: () => setSearchQuery(""),
                  className: "absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1",
                  children: jsx(XIcon, { className: "h-4 w-4" })
                }) : null
              ]
            })
          ]
        }),

        // Category Filter Scroll Container (Smooth touch swipe & drag)
        jsx("div", {
          ref: scrollContainerRef,
          onMouseDown: handleMouseDown,
          onMouseLeave: handleMouseLeave,
          onMouseUp: handleMouseUp,
          onMouseMove: handleMouseMove,
          className: "category-scroll-container w-full max-w-full pb-4 pt-1 border-b border-border/60 mb-8 select-none",
          style: {
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          },
          children: jsxs("div", {
            className: "category-scroll-inner flex items-center gap-2 px-1 w-max min-w-min sm:mx-auto",
            children: [
              jsx("button", {
                type: "button",
                onClick: (e) => { if (hasMoved.current) return; setSelectedCategory("all"); },
                className: `whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-foreground text-card shadow-sm"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-olive/50"
                }`,
                children: "✨ All Plans"
              }),
              ...categoryList.map(cat =>
                jsx("button", {
                  key: cat.id,
                  type: "button",
                  onClick: (e) => { if (hasMoved.current) return; setSelectedCategory(cat.id); },
                  className: `whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-foreground text-card shadow-sm"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-olive/50"
                  }`,
                  children: `${cat.emoji} ${cat.name}`
                })
              )
            ]
          })
        }),

        // Product Cards Grid
        filteredServices.length > 0 ? jsxs("div", {
          className: "w-full max-w-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 animate-fade-up box-border",
          children: filteredServices.map(service =>
            jsx(ProductCard, { product: service }, service.id)
          )
        }) : jsxs("div", {
          className: "py-16 text-center bg-card rounded-2xl border border-dashed border-border mt-4 w-full",
          children: [
            jsx("p", { className: "text-lg font-medium", children: "No services found matching your query" }),
            jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Try adjusting your search terms or clearing the filter." }),
            jsx("button", {
              onClick: () => { setSelectedCategory("all"); setSearchQuery(""); },
              className: "mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer",
              children: "Reset All Filters"
            })
          ]
        }),

        // Bottom WhatsApp Support Banner
        jsxs("div", {
          className: "mt-16 rounded-2xl border border-olive/30 bg-olive/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 w-full box-border",
          children: [
            jsxs("div", {
              className: "text-center sm:text-left",
              children: [
                jsx("h3", { className: "text-lg sm:text-xl font-bold", children: "Can't find the plan you need?" }),
                jsx("p", {
                  className: "mt-1 text-xs sm:text-sm text-muted-foreground",
                  children: "We activate custom services, corporate plans, private servers, and unique account requests on WhatsApp."
                })
              ]
            }),
            jsxs("a", {
              href: "https://wa.me/919250806417?text=Hi%20Socialpeak,%20I%20need%20a%20custom%20activation",
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-semibold shadow hover:opacity-95 transition hover:scale-105 shrink-0",
              children: [
                jsx(MessageCircleIcon, { className: "h-4 w-4" }),
                "Chat on WhatsApp"
              ]
            })
          ]
        })
      ]
    })
  });
}

export { ServicesPage as component };