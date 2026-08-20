"use client";

import { Locale } from "@/app/components/language-provider";

const logoUrl = "https://pub-62bfc7a22a614d1592c5f36b18a45274.r2.dev/al-salah-logo-bg.png";

const languages: { locale: Locale; name: string; flagSrc: string; flagAlt: string }[] = [
  { locale: "fr", name: "Français", flagSrc: "/flags/france.svg", flagAlt: "France" },
  { locale: "en", name: "English", flagSrc: "/flags/united-kingdom.svg", flagAlt: "United Kingdom" },
  { locale: "ary", name: "الدارجة", flagSrc: "/flags/morocco.svg", flagAlt: "Morocco" },
];

export function LanguageWelcome({ onChoose }: { onChoose: (locale: Locale) => void }) {
  return (
    <main dir="ltr" className="grid min-h-screen place-items-center bg-surface px-6 py-12 text-on-surface">
      <section className="w-full max-w-md text-center">
        <img src={logoUrl} alt="Al Salah" className="mx-auto h-36 w-36 rounded-full object-contain" />
        <h1 className="mt-9 font-headline-lg text-headline-lg text-primary">Bienvenue à l’agence Al Salah</h1>
        <p className="mt-3 text-body-lg text-on-surface-variant">Veuillez choisir votre langue.</p>
        <div className="mt-9 grid gap-3">
          {languages.map(({ locale, name, flagSrc, flagAlt }) => (
            <button
              key={locale}
              type="button"
              onClick={() => onChoose(locale)}
              className="flex w-full items-center justify-start gap-3 rounded-xl border border-outline-variant/50 bg-white px-6 py-4 text-base font-bold shadow-sm transition hover:border-primary hover:bg-primary hover:text-on-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="grid h-6 w-9 shrink-0 place-items-center overflow-hidden rounded-sm bg-white shadow-sm">
                <img src={flagSrc} alt={flagAlt} className="h-full w-full object-cover" />
              </span>
              <span lang={locale === "ary" ? "ary-MA" : locale} dir={locale === "ary" ? "rtl" : "ltr"}>{name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
