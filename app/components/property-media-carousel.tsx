"use client";

import { useState } from "react";

type Media = { url: string; type: "image" | "video" };

export function PropertyMediaCarousel({ images, videoUrl, address }: { images: string[]; videoUrl: string | null; address: string }) {
  const media: Media[] = [...images.map((url) => ({ url, type: "image" as const })), ...(videoUrl ? [{ url: videoUrl, type: "video" as const }] : [])];
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  if (media.length === 0) return null;
  const move = (direction: -1 | 1) => setActive((current) => (current + direction + media.length) % media.length);
  const currentIndex = active % media.length;
  const current = media[currentIndex];
  const handleImageSwipe = (end: number | null) => { if (touchStart !== null && end !== null) { if (end - touchStart > 40) move(-1); if (touchStart - end > 40) move(1); } setTouchStart(null); };

  return <section className="mt-8 overflow-hidden rounded-3xl bg-inverse-surface shadow-xl">
    <div className="relative aspect-[4/3] min-h-72 w-full bg-black sm:aspect-[16/10]">
      <div className="absolute inset-x-4 top-4 z-10 flex gap-1.5" aria-label={`Media item ${currentIndex + 1} of ${media.length}`}>{media.map((item, index) => <span key={`${item.url}-${index}`} className={`h-1 flex-1 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/40"}`}/>)}</div>
      {current.type === "video" ? <video key={current.url} controls autoPlay muted playsInline preload="metadata" poster={images[0]} className="size-full object-contain" src={current.url}>Your browser does not support video.</video> : <img src={current.url} alt={`${address} — image ${currentIndex + 1}`} className="size-full object-cover" onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => handleImageSwipe(event.changedTouches[0]?.clientX ?? null)}/>}
      {media.length > 1 && <><button type="button" onClick={() => move(-1)} className="absolute left-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-2xl text-white backdrop-blur transition hover:bg-black/65" aria-label="Previous media">‹</button><span className="absolute right-4 top-8 z-10 rounded-full bg-black/45 px-3 py-1 text-sm font-semibold text-white backdrop-blur">{currentIndex + 1} / {media.length}</span><button type="button" onClick={() => move(1)} className="absolute right-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-2xl text-white backdrop-blur transition hover:bg-black/65" aria-label="Next media">›</button></>}
    </div>
    <div className="flex gap-2 overflow-x-auto bg-inverse-surface px-4 py-3 hide-scrollbar">{media.map((item, index) => <button type="button" key={`${item.url}-${index}`} onClick={() => setActive(index)} aria-label={`Show ${item.type} ${index + 1}`} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === currentIndex ? "border-secondary-fixed" : "border-transparent opacity-60"}`}>{item.type === "video" ? <video muted preload="metadata" className="size-full object-cover" src={item.url}/> : <img src={item.url} alt="" className="size-full object-cover"/>}{item.type === "video" && <span className="absolute inset-0 grid place-items-center bg-black/30 text-white">▶</span>}</button>)}</div>
  </section>;
}
