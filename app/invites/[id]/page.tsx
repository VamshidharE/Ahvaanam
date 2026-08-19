import type { Metadata } from "next";
import InviteClient from "./InviteClient";
import { getInvitationMeta } from "@/lib/utils/invitationMeta";
import { getBaseUrl } from "@/lib/utils/baseUrl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const meta = await getInvitationMeta(id);
  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/invites/${id}`;
  const ogImageUrl = `${baseUrl}/invites/${id}/opengraph-image`;

  return {
    metadataBase: new URL(baseUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: pageUrl,
      siteName: "Ahvaanam",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function GuestInvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InviteClient clientId={id} />;
}
