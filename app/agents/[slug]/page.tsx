import Link from "next/link";
import { notFound } from "next/navigation";
import { Agent } from "@/app/lib/properties";
import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";
export default async function AgentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured || !supabase) notFound();
  const { data } = await supabase.from("agents").select("*").eq("slug", slug).eq("published", true).single();
  const agent = data as Agent | null;
  if (!agent) notFound();
  const firstName = agent.name.split(" ")[0];
  return <main className="min-h-screen bg-surface text-on-surface"><header className="border-b border-outline-variant/40 bg-surface"><nav className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-desktop"><Link href="/" className="font-headline-md text-headline-md font-bold text-primary">EstateFlow</Link><Link href="/agents" className="font-semibold text-primary">← All agents</Link></nav></header><section className="mx-auto grid max-w-container-max gap-12 px-margin-desktop py-16 lg:grid-cols-[minmax(0,1fr)_360px]"><div><div className="flex flex-col gap-7 sm:flex-row"><img src={agent.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"} alt={agent.name} className="h-52 w-52 rounded-xl object-cover" /><div><p className="text-label-bold font-label-bold uppercase text-secondary">{agent.city}</p><h1 className="mt-3 font-display-lg text-display-lg">{agent.name}</h1><p className="mt-2 font-headline-md text-headline-md text-primary">{agent.title}</p><p className="mt-4 max-w-xl text-body-lg text-on-surface-variant">{agent.bio}</p></div></div><div className="mt-12 border-t border-outline-variant/40 pt-10"><h2 className="font-headline-lg text-headline-lg">About {firstName}</h2><p className="mt-4 max-w-2xl text-on-surface-variant">{agent.about}</p><div className="mt-10 grid grid-cols-3 gap-4"><Metric label="Experience" value={agent.experience}/><Metric label="Career sales" value={agent.sales}/><Metric label="Languages" value={agent.languages}/></div></div></div><aside className="h-fit rounded-xl border border-outline-variant/50 bg-white p-7 shadow-sm"><p className="text-label-bold font-label-bold uppercase text-secondary">Contact {firstName}</p><h2 className="mt-2 font-headline-lg text-headline-lg">Start a conversation</h2>{agent.phone && <a href={`tel:${agent.phone.replace(/[^+\d]/g, "")}`} className="mt-7 block rounded-lg bg-primary px-5 py-3 text-center font-bold text-on-primary">Call {agent.phone}</a>}{agent.email && <a href={`mailto:${agent.email}`} className="mt-3 block rounded-lg border border-primary px-5 py-3 text-center font-bold text-primary">Email {firstName}</a>}</aside></section></main>;
}
function Metric({ label, value }: { label: string; value: string | null }) { return <div className="rounded-xl bg-surface-container-low p-5"><p className="text-sm text-outline">{label}</p><p className="mt-2 font-headline-md text-headline-md">{value || "—"}</p></div>; }
