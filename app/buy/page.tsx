import PropertyExplorePage from "../components/property-explore-page";

export default async function BuyPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) { const { type } = await searchParams; return <PropertyExplorePage mode="sale" initialType={type ?? ""}/>; }
