export type Property = {
  id: string;
  listing_type: "sale" | "rent" | "reservation" | "land";
  property_type: "house" | "apartment" | "villa" | "land";
  city: string;
  price: number;
  currency: string;
  price_suffix: string | null;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  details: string | null;
  description: string | null;
  gallery: string[] | null;
  video_url: string | null;
  instagram_video_url: string | null;
  is_luxury: boolean;
  is_good_deal: boolean;
  country_support: 70000 | 100000 | null;
  facilities: string[] | null;
  agent_id: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export function formatPrice(property: Pick<Property, "price" | "currency" | "price_suffix">) {
  return `${new Intl.NumberFormat("en-US").format(property.price)} DH${property.price_suffix ? ` ${property.price_suffix}` : ""}`;
}

export type Agent = {
  id: string;
  slug: string;
  name: string;
  city: string;
  title: string;
  bio: string | null;
  about: string | null;
  image_url: string | null;
  phone: string | null;
  email: string | null;
  experience: string | null;
  sales: string | null;
  languages: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  published: boolean;
};

export function propertyFacts(property: Property, t: (key: string) => string) {
  return [
    property.bedrooms !== null ? `${property.bedrooms} ${t("beds")}` : null,
    property.bathrooms !== null ? `${property.bathrooms} ${t("baths")}` : null,
    property.area_m2 !== null ? `${new Intl.NumberFormat("en-US").format(property.area_m2)} m²` : null,
  ].filter(Boolean).join(" · ") || property.details || t("detailsAvailableOnRequest");
}
