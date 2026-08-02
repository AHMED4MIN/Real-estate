// app/page.tsx
"use client"; // Required for browser APIs, state, and effects

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  // ----- State for search suggestions -----
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // ----- Refs for carousel -----
  const carouselRef = useRef<HTMLDivElement>(null);

  // ----- Header scroll effect -----
  useEffect(() => {
    const header = document.getElementById("main-nav");
    const nav = header?.querySelector("nav");
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header?.classList.add("shadow-md", "h-16");
        nav?.classList.replace("h-20", "h-16");
      } else {
        header?.classList.remove("shadow-md", "h-16");
        nav?.classList.replace("h-16", "h-20");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----- Click outside to close suggestions -----
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ----- Carousel scroll handlers -----
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 400;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/buy?query=${encodeURIComponent(query)}` : "/buy");
  };

  return (
    <>
      {/* ===== TOP NAVBAR ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm h-20 transition-all duration-300"
        id="main-nav"
      >
        <nav className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-12">
            <a className="font-headline-md text-headline-md font-bold text-primary" href="#">
              EstateFlow
            </a>
            <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
              {/* Buy Dropdown */}
              <div className="relative group">
                <a
                  className="text-primary border-b-2 border-primary font-bold pb-1 transition-colors flex items-center gap-1"
                  href="/buy"
                >
                  Buy
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/buy?type=houses" className="block px-4 py-2 hover:bg-primary hover:text-white transition-colors">
                    Homes
                  </a>
                  <a href="/buy?type=apartments" className="block px-4 py-2 hover:bg-primary hover:text-white transition-colors">
                    Apartments
                  </a>
                  <a href="/buy?type=apartments" className="block px-4 py-2 hover:bg-primary hover:text-white transition-colors">
                    Villas
                  </a>
                </div>
              </div>

              {/* Rent Dropdown */}

                <a
                  className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                  href="/rent"
                >
                  Rent
                </a>
                  

              <a className="text-on-surface-variant hover:text-primary transition-colors" href="/sell">
                Sell
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="/land">
                Land
              </a>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
                href="/agents"
              >
                Find an Agent
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative group hidden lg:block">
              <button className="flex items-center gap-2 px-4 py-2 text-primary font-medium hover:bg-surface-container-low rounded-lg transition-all">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Language</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 origin-top-right group-hover:scale-100 scale-95">
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span className="text-lg">🇫🇷</span>
                    <span>Français</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span className="text-lg">🇲🇦</span>
                    <span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "1rem" }}>
                      الدارجة
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-on-surface-variant">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* ===== HERO SECTION ===== */}
        <section className="relative h-[780px] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYXIYLMxcDDyTH_2PrO_fJeLirEuZ_4GJq_KZdtWANJ9ghWxYACXrj6izT3xhVZVkiIPMrW6hvulQaCkLo25czrVL251YSmHkvddhaS4CNdUBsemoY_enLXb5lj6AfFJcwdavI7WdzT2irarcdgWyqZb6rTbOnDc5zOLylW7cW7xhMBkVCVrMK9I1Kg6jiBrkQYGBg8bGcqBP5zRsIdIExXTR2yJanwKkuQ_WRQ78MREUnBsLhnGDPoA')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/60 to-transparent" />
          </div>
          <div className="relative z-10 w-full -translate-y-10 px-margin-desktop max-w-container-max mx-auto md:-translate-y-14">
            <div className="max-w-2xl text-on-primary">
              <h1 className="font-display-lg text-display-lg mb-stack-md">
                Discover the Home You&apos;ve Always Dreamed Of.
              </h1>
              <p className="font-body-lg text-body-lg mb-stack-lg text-surface-container-lowest opacity-90">
                Experience the next generation of real estate. Precision data meets human expertise to
                guide your journey home.
              </p>
              <div className="glass-card p-6 rounded-xl shadow-lg border border-white/20">
                <div className="flex gap-4 mb-stack-md">
                  <button className="px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-sm transition-all">
                    Buy
                  </button>
                  <button className="px-4 py-2 rounded-full hover:bg-surface-variant/50 text-on-surface font-semibold text-sm transition-all">
                    Rent
                  </button>
                  <button className="px-4 py-2 rounded-full hover:bg-surface-variant/50 text-on-surface font-semibold text-sm transition-all">
                    Land
                  </button>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-lg border border-outline-variant focus-within:border-primary transition-all p-1">
                  <span className="material-symbols-outlined ml-3 text-outline">search</span>
                  <input
                    ref={searchInputRef}
                    className="w-full border-none focus:ring-0 px-3 py-3 text-on-surface placeholder:text-outline font-body-md"
                    id="main-search"
                    placeholder="Address, ZIP, or Neighborhood"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  <button type="submit" className="bg-primary text-on-primary px-8 py-3 rounded-md font-bold hover:bg-primary-container transition-all">
                    Search
                  </button>
                  {/* Suggestions */}
                  <div
                    ref={suggestionsRef}
                    className={`absolute top-[calc(100%+8px)] left-0 right-0 bg-white shadow-xl rounded-lg border border-outline-variant overflow-hidden z-20 ${
                      showSuggestions ? "" : "hidden"
                    }`}
                  >
                    <button type="button" onClick={() => { setSearchQuery("Beverly Hills"); setShowSuggestions(false); }} className="w-full px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 text-left">
                      <span className="material-symbols-outlined text-outline">location_on</span>
                      <span className="text-on-surface">
                        Beverly Hills, <span className="text-secondary font-bold">CA</span>
                      </span>
                    </button>
                    <button type="button" onClick={() => { setSearchQuery("Brooklyn Heights"); setShowSuggestions(false); }} className="w-full px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 border-t border-outline-variant/30 text-left">
                      <span className="material-symbols-outlined text-outline">location_on</span>
                      <span className="text-on-surface">
                        Brooklyn Heights, <span className="text-secondary font-bold">NY</span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MARKET STATS ===== */}
        <section className="py-stack-lg bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter text-center">
              <div className="flex flex-col items-center">
                <span className="text-label-bold font-label-bold text-outline uppercase tracking-widest mb-1">
                  Median Sale Price
                </span>
                <span className="font-headline-lg text-headline-lg text-primary">$842,500</span>
                <div className="flex items-center gap-1 text-secondary mt-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span className="text-xs font-bold">+4.2% YoY</span>
                </div>
              </div>
              <div className="flex flex-col items-center border-x-0 md:border-x border-outline-variant/30">
                <span className="text-label-bold font-label-bold text-outline uppercase tracking-widest mb-1">
                  Active Listings
                </span>
                <span className="font-headline-lg text-headline-lg text-primary">12,842</span>
                <span className="text-xs text-outline mt-1 font-medium">Updated 5 mins ago</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-label-bold font-label-bold text-outline uppercase tracking-widest mb-1">
                  Days on Market
                </span>
                <span className="font-headline-lg text-headline-lg text-primary">18 Days</span>
                <div className="flex items-center gap-1 text-error mt-1">
                  <span className="material-symbols-outlined text-sm">speed</span>
                  <span className="text-xs font-bold">Record Low</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURED LISTINGS ===== */}
        <section className="py-24 bg-surface">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  Featured Homes
                </h2>
                <p className="text-on-surface-variant font-body-md">
                  Hand-picked premium listings in your most searched areas.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-3 rounded-full border border-outline-variant hover:bg-surface-variant transition-all"
                  onClick={() => scrollCarousel("left")}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  className="p-3 rounded-full border border-outline-variant hover:bg-surface-variant transition-all"
                  onClick={() => scrollCarousel("right")}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-gutter overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8"
            >
              {/* Card 1 */}
              <div className="min-w-[420px] snap-start">
                <div className="property-card-shadow bg-white rounded-xl overflow-hidden group">
                  <div className="relative h-64">
                    <img
                      className="w-full h-full object-cover"
                      alt="A cinematic architectural photograph of a sleek mid-century modern home nestled in lush evergreen foliage."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsJh5KkLuXu1__HKRTAkZg1wGCrQBKzroKcdj4ACGPEJuvslfO7cC3EhE-NXpB5OvsOMNCzJnyh2HrW_0WehvxlJ8ZCssi0ZVCRBWxGViYrG5ozovv4WDHMaGjPmBBYHVCOUaSMxWvNMnwIaTj2CYPL72iCe8sss5gHMxeeab_N94UiliCoNIKXcyLEf6do9CNckkhPvbdA6au9OutoWahTVKvamGbpIVz43zFswaca7OY4yZvo3nUkA"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-error transition-all">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        New
                      </span>
                      <span className="bg-primary text-on-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Luxury
                      </span>
                    </div>
                  </div>
                  <div className="p-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface">$1,450,000</h3>
                    <p className="text-on-surface-variant text-body-sm mb-stack-md">
                      1248 Skyline Drive, Los Angeles, CA
                    </p>
                    <div className="property-specs flex items-center gap-4 text-outline font-body-sm border-t border-outline-variant/30 pt-stack-sm">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bed</span>
                        <span>4 Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bathtub</span>
                        <span>3 Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">square_foot</span>
                        <span>3,200 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="min-w-[420px] snap-start">
                <div className="property-card-shadow bg-white rounded-xl overflow-hidden group">
                  <div className="relative h-64">
                    <img
                      className="w-full h-full object-cover"
                      alt="An ultra-modern minimalist villa with white concrete walls and asymmetrical cantilevered roofs overlooking a serene turquoise ocean."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF1izBdApHrgvpEvJMFuV_4JvMRDY8LkDESdwik12npElisX3F5sGq7GU00OlXnLKJsuyAwfKdbc5YgTqn1l2CkfVRmuuwav3vH3RV9RKUU7ylJe6AKm68VdblnFuJyv1Q9EFn3Bk3ARMdf0ZcLD39zqWkNraMpIMzJbh21ShKTK4lDo7m_DryeGaqtXS3KsrpUPXwUJgxKKarNuDg37mMToPFiGfFRNIzfRcdt-p87CuXpPKVpOOQRA"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-error transition-all">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </button>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Price Drop
                      </span>
                    </div>
                  </div>
                  <div className="p-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface">$2,200,000</h3>
                    <p className="text-on-surface-variant text-body-sm mb-stack-md">
                      77 Ocean View Terrace, Malibu, CA
                    </p>
                    <div className="property-specs flex items-center gap-4 text-outline font-body-sm border-t border-outline-variant/30 pt-stack-sm">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bed</span>
                        <span>5 Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bathtub</span>
                        <span>4.5 Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">square_foot</span>
                        <span>4,150 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="min-w-[420px] snap-start">
                <div className="property-card-shadow bg-white rounded-xl overflow-hidden group">
                  <div className="relative h-64">
                    <img
                      className="w-full h-full object-cover"
                      alt="A sophisticated industrial-style loft apartment with exposed brick walls, high timber ceilings, and large factory windows."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMC-1GsRAe09J9zA1LuaFh_8LU8Dgukx_xGQbfswlgX_98vZceS__e0m9i7OsEp_tdAYdjuz3K33YfHwdG3F49Q5-WksjyYM_Hnj3moAHhZbe8tUn5MG39VhO2TBNfnWz03XHTgKC2Gx4zUdjNJBdb6zKrL8mdtxiBHXMbJdR81Pv1Tqp3_ALYfNhXaGOQLwayrOfzz0pfNljzdkwejpdnnxj5ULN-aUCohkQppmUOksZ-Vk1hCBUo_A"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-error transition-all">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-inverse-surface text-on-surface-variant px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        New Construction
                      </span>
                    </div>
                  </div>
                  <div className="p-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface">$895,000</h3>
                    <p className="text-on-surface-variant text-body-sm mb-stack-md">
                      212 Foundry St, Seattle, WA
                    </p>
                    <div className="property-specs flex items-center gap-4 text-outline font-body-sm border-t border-outline-variant/30 pt-stack-sm">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bed</span>
                        <span>2 Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bathtub</span>
                        <span>2 Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">square_foot</span>
                        <span>1,800 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="min-w-[420px] snap-start">
                <div className="property-card-shadow bg-white rounded-xl overflow-hidden group">
                  <div className="relative h-64">
                    <img
                      className="w-full h-full object-cover"
                      alt="A stunning modern farmhouse with a crisp white board-and-batten exterior, black-framed windows, and a wide wraparound porch."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6DUN7_yX6BgIimvNiAkH5lz1RUY1s9PlPKeBbuAFbRVsksHzMb2SinlgcDbh6KMMaWs0zbTGaA10t20eZJFIKq7djOYaBTVvNCbPGpX661KiAQb32FBc_blwBOXEpnti9zyLUjd8xgB4MUZ_X4YBaYy2gsCOQ_TtER8PA1N-5Pu7DKjbZ7U4YBvPPRYRi657HJukPnNgOsqxiKHoEws41mi8_hENTHOIU-uRl78gkcSUjbDQK-kub9Q"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-error transition-all">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  <div className="p-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface">$1,150,000</h3>
                    <p className="text-on-surface-variant text-body-sm mb-stack-md">
                      45 Oak Lane, Nashville, TN
                    </p>
                    <div className="property-specs flex items-center gap-4 text-outline font-body-sm border-t border-outline-variant/30 pt-stack-sm">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bed</span>
                        <span>4 Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bathtub</span>
                        <span>3.5 Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">square_foot</span>
                        <span>2,900 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                Your Property Journey, Simplified.
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md">
                Whether you&apos;re moving in or moving on, we provide the tools and expertise for a
                seamless experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Buyers */}
              <div className="bg-surface p-8 rounded-2xl border border-outline-variant/20 hover:border-primary transition-colors group">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">real_estate_agent</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">For Buyers</h3>
                <p className="text-on-surface-variant mb-6 font-body-sm">
                  Access exclusive listings, automated price alerts, and personalized agent matches to
                  find your next home faster.
                </p>
                <a
                  className="text-primary font-bold inline-flex items-center gap-2 group/link"
                  href="#"
                >
                  Find a Home{" "}
                  <span className="material-symbols-outlined transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>

              {/* Sellers */}
              <div className="bg-surface p-8 rounded-2xl border border-outline-variant/20 hover:border-primary transition-colors group">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container mb-6 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    sell
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">For Sellers</h3>
                <p className="text-on-surface-variant mb-6 font-body-sm">
                  Sell with confidence using our data-driven valuation tools and high-visibility
                  marketing platform reaching millions.
                </p>
                <a
                  className="text-primary font-bold inline-flex items-center gap-2 group/link"
                  href="#"
                >
                  List Your Property{" "}
                  <span className="material-symbols-outlined transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>

              {/* Renters */}
              <div className="bg-surface p-8 rounded-2xl border border-outline-variant/20 hover:border-primary transition-colors group">
                <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">key</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">For Renters</h3>
                <p className="text-on-surface-variant mb-6 font-body-sm">
                  Simplify your rental search with verified listings, online applications, and secure
                  lease management tools.
                </p>
                <a
                  className="text-primary font-bold inline-flex items-center gap-2 group/link"
                  href="#"
                >
                  Explore Rentals{" "}
                  <span className="material-symbols-outlined transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-inverse-surface text-on-primary-fixed border-t border-outline-variant">
        <div className="w-full py-stack-lg px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="col-span-1 md:col-span-1">
            <a className="font-headline-md text-headline-md font-bold text-on-primary-fixed mb-4 block" href="#">
              EstateFlow
            </a>
            <p className="text-outline-variant font-body-sm max-w-xs">
              Empowering people through transparent data and professional real estate expertise.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-label-bold uppercase tracking-wider text-xs">
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Market Trends
              </a>
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Resources
              </a>
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Find an Agent
              </a>
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Mortgage Calculator
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-label-bold uppercase tracking-wider text-xs">
              Legal
            </h4>
            <div className="flex flex-col gap-3">
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Terms of Service
              </a>
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Cookie Policy
              </a>
              <a className="text-outline-variant hover:text-secondary-fixed transition-colors" href="#">
                Accessibility
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-label-bold uppercase tracking-wider text-xs">
              Social
            </h4>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-white">qr_code_2</span>
              </a>
              <a
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-white">alternate_email</span>
              </a>
              <a
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-white">linked_camera</span>
              </a>
            </div>
          </div>
        </div>
        <div className="w-full py-8 px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-outline-variant font-body-sm">
            © 2026 EstateFlow Real Estate. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
          
          </div>
        </div>
      </footer>

    </>
  );
}
