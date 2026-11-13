import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDemoShowcase, SUPPORTED_DEMO_SLUGS } from "@/lib/demo/demoService";
import { getDemoSampleData } from "@/lib/demo/demoData";
import DemoClientWrapper from "./DemoClientWrapper";
import { getBaseUrl } from "@/lib/utils/baseUrl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = await getDemoShowcase(slug);

  if (!demo || !demo.is_published) {
    return {
      title: "Invitation Demo Not Found | Ahvaanam",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/demo/${demo.slug}`;

  return {
    title: `${demo.name} – Live Wedding Invitation Demo | Ahvaanam`,
    description: demo.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${demo.name} – Live Wedding Invitation Demo`,
      description: demo.description,
      url: pageUrl,
      siteName: "Ahvaanam",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${demo.name} – Live Wedding Invitation Demo`,
      description: demo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DemoShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = (slug || "").toLowerCase().trim();

  // 1. Strict slug validation
  if (!SUPPORTED_DEMO_SLUGS.includes(normalizedSlug)) {
    notFound();
  }

  // 2. Publication state validation from service
  const demo = await getDemoShowcase(normalizedSlug);
  if (!demo || !demo.is_published) {
    notFound();
  }

  // 3. Isolated safe demo sample data
  const sampleData = getDemoSampleData(demo.slug, demo.templateId);

  return (
    <DemoClientWrapper
      slug={demo.slug}
      templateId={demo.templateId}
      templateName={demo.name}
      sampleData={sampleData}
    />
  );
}
