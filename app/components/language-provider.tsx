"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "fr" | "ary";
type Dictionary = Record<string, Record<Locale, string>>;

const copy: Dictionary = {
  buy: { en: "Buy", fr: "Acheter", ary: "شري" }, rent: { en: "Rent", fr: "Louer", ary: "كري" }, sell: { en: "Sell", fr: "Vendre", ary: "بيع" }, land: { en: "Land", fr: "Terrain", ary: "أرض" }, agents: { en: "Find an agent", fr: "Trouver un agent", ary: "لقا وكيل" }, language: { en: "Language", fr: "Langue", ary: "اللغة" }, allCities: { en: "All cities", fr: "Toutes les villes", ary: "جميع المدن" }, allTypes: { en: "All property types", fr: "Tous les types", ary: "جميع الأنواع" }, search: { en: "Search", fr: "Rechercher", ary: "قلب" }, propertiesFound: { en: "properties found", fr: "biens trouvés", ary: "عقارات تلقاو" }, propertyType: { en: "Property type", fr: "Type de bien", ary: "نوع العقار" }, city: { en: "City", fr: "Ville", ary: "المدينة" }, connect: { en: "Admin sign in", fr: "Connexion admin", ary: "دخول الإدارة" }, homes: { en: "Homes", fr: "Maisons", ary: "ديور" }, apartments: { en: "Apartments", fr: "Appartements", ary: "شقق" }, villas: { en: "Villas", fr: "Villas", ary: "ڤيلات" }, noProperties: { en: "No published properties found yet.", fr: "Aucun bien publié pour le moment.", ary: "ما كاين حتى عقار منشور دابا." }, backHome: { en: "Back to home", fr: "Retour à l'accueil", ary: "رجع للرئيسية" }, featured: { en: "Featured properties", fr: "Biens à la une", ary: "عقارات مميزة" }, totalProperties: { en: "Properties", fr: "Biens", ary: "العقارات" }, cities: { en: "Cities", fr: "Villes", ary: "المدن" }, agentsCount: { en: "Agents", fr: "Agents", ary: "الوكلاء" },
};

const LanguageContext = createContext({ locale: "en" as Locale, setLocale: (_locale: Locale) => {}, t: (key: string) => copy[key]?.en ?? key });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => { const saved = window.localStorage.getItem("estateflow-locale") as Locale | null; if (saved === "en" || saved === "fr" || saved === "ary") setLocale(saved); }, []);
  useEffect(() => { document.documentElement.lang = locale === "ary" ? "ar-MA" : locale; document.documentElement.dir = locale === "ary" ? "rtl" : "ltr"; window.localStorage.setItem("estateflow-locale", locale); }, [locale]);
  return <LanguageContext.Provider value={{ locale, setLocale, t: (key) => copy[key]?.[locale] ?? copy[key]?.en ?? key }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
