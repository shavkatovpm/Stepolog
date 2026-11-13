import { getAgencies, getCategories } from "@/lib/agencies";
import TestVariants from "@/components/test/TestVariants";

export const metadata = {
  title: "Test — Agentliklar UI variantlari",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function TestPage({ params }: Props) {
  const { locale } = await params;
  const agencies = getAgencies(locale);
  const categories = getCategories(locale);

  return <TestVariants agencies={agencies} categories={categories} />;
}
