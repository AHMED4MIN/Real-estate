export type Property = {
  id: string;
  listing_type: "sale" | "rent" | "land";
  property_type: "house" | "apartment" | "villa" | "land";
  city: string;
  price: number;
  currency: string;
  price_suffix: string | null;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  details: string | null;
  description: string | null;
  gallery: string[] | null;
  badge: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export function formatPrice(property: Pick<Property, "price" | "currency" | "price_suffix">) {
  return `${property.currency}${new Intl.NumberFormat("en-US").format(property.price)}${property.price_suffix ? ` ${property.price_suffix}` : ""}`;
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
  published: boolean;
};

export function propertyFacts(property: Property) {
  return [
    property.bedrooms !== null ? `${property.bedrooms} Beds` : null,
    property.bathrooms !== null ? `${property.bathrooms} Baths` : null,
    property.area_sqft !== null ? `${new Intl.NumberFormat("en-US").format(property.area_sqft)} sqft` : null,
  ].filter(Boolean).join(" · ") || property.details || "Details available on request";
}
