"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Agent } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";
import { SiteHeader } from "@/app/components/site-header";
import { useLanguage } from "@/app/components/language-provider";

export default function AgentsPage() {
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    void supabase.from("agents").select("*").eq("published", true).order("name").then(({ data, error }) => {
      if (error) { setError(error.message); return; }
      setAgents((data ?? []) as Agent[]);
    });
  }, []);
  return <main className="min-h-screen bg-surface text-on-surface"><SiteHeader/><section className="bg-surface-container-low py-16"><div className="mx-auto max-w-container-max px-margin-desktop"><p className="text-label-bold font-label-bold uppercase text-secondary">{t("localExpertise")}</p><h1 className="mt-3 max-w-2xl font-display-lg text-display-lg">{t("findAgent")}</h1></div></section><section className="mx-auto max-w-container-max px-margin-desktop py-20">{error ? <p>{t("couldNotLoadAgents")}: {error}</p> : agents.length === 0 ? <p className="rounded-xl border border-dashed p-10 text-center text-on-surface-variant">{t("noAgents")}</p> : <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">{agents.map((agent) => <Link key={agent.id} href={`/agents/${agent.slug}`} className="property-card-shadow overflow-hidden rounded-xl bg-white"><img src={agent.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"} alt={agent.name} className="h-64 w-full object-cover"/><div className="p-stack-md"><p className="text-label-bold font-label-bold uppercase text-secondary">{agent.city}</p><h2 className="mt-2 font-headline-md text-headline-md">{agent.name}</h2><p className="mt-1 text-sm font-semibold text-primary">{agent.title}</p><p className="mt-4 text-body-sm text-on-surface-variant">{agent.bio}</p></div></Link>)}</div>}</section></main>;
}