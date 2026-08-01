"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <header className="border-b border-outline-variant/40 bg-surface">
        <nav className="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-margin-desktop">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">EstateFlow</Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/buy" className="text-on-surface-variant hover:text-primary">Buy</Link>
            <Link href="/rent" className="text-on-surface-variant hover:text-primary">Rent</Link>
            <Link href="/land" className="text-on-surface-variant hover:text-primary">Land</Link>
            <Link href="/agents" className="text-on-surface-variant hover:text-primary">Find an Agent</Link>
          </div>
          <Link href="/" className="font-semibold text-primary">Back to home</Link>
        </nav>
      </header>

      <section className="bg-surface-container-low py-16">
        <div className="mx-auto max-w-container-max px-margin-desktop">
          <p className="text-label-bold font-label-bold uppercase text-secondary">Sell with EstateFlow</p>
          <h1 className="mt-3 max-w-2xl font-display-lg text-display-lg">Tell us about your property.</h1>
          <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">Share a few details and we&apos;ll help you take the next step toward selling with confidence.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-container-max gap-12 px-margin-desktop py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-outline-variant/50 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8"><h2 className="font-headline-lg text-headline-lg">Property details</h2><p className="mt-2 text-body-sm text-on-surface-variant">We&apos;ll use this information to understand your property before we contact you.</p></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold text-on-surface">Full name<input required name="fullName" autoComplete="name" className="mt-2 w-full rounded-lg border border-outline-variant/60 px-4 py-3 font-normal outline-none transition-colors focus:border-primary" placeholder="Your full name" /></label>
            <label className="block text-sm font-bold text-on-surface">Phone number<input required name="phone" type="tel" autoComplete="tel" className="mt-2 w-full rounded-lg border border-outline-variant/60 px-4 py-3 font-normal outline-none transition-colors focus:border-primary" placeholder="+1 (000) 000-0000" /></label>
          </div>
          <label className="mt-5 block text-sm font-bold text-on-surface">Property address<input required name="address" autoComplete="street-address" className="mt-2 w-full rounded-lg border border-outline-variant/60 px-4 py-3 font-normal outline-none transition-colors focus:border-primary" placeholder="Street address, city, state, ZIP" /></label>
          <label className="mt-5 block text-sm font-bold text-on-surface">Property description<textarea required name="description" rows={6} className="mt-2 w-full resize-y rounded-lg border border-outline-variant/60 px-4 py-3 font-normal outline-none transition-colors focus:border-primary" placeholder="Tell us the property type, number of rooms, condition, and anything else you would like us to know." /></label>
          <button type="submit" className="mt-7 rounded-lg bg-primary px-7 py-3 font-bold text-on-primary transition-colors hover:bg-primary-container">Request a selling consultation</button>
          {submitted && <p className="mt-4 rounded-lg bg-secondary-container px-4 py-3 text-sm font-semibold text-on-secondary-container">Thanks—we&apos;ve received your details. An EstateFlow specialist will be in touch soon.</p>}
        </form>

        <aside className="h-fit rounded-xl bg-inverse-surface p-8 text-inverse-on-surface">
          <p className="text-label-bold font-label-bold uppercase text-secondary-fixed">Prefer to talk first?</p>
          <h2 className="mt-3 font-headline-lg text-headline-lg">Meet a local agent.</h2>
          <p className="mt-4 text-body-sm text-surface-variant">Get a personal opinion on pricing, preparation, and the best plan for selling your home.</p>
          <Link href="/agents" className="mt-7 inline-flex rounded-lg bg-white px-5 py-3 font-bold text-primary transition-colors hover:bg-secondary-container">Find an agent</Link>
        </aside>
      </section>
    </main>
  );
}
