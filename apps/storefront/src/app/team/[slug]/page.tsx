import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamMember, getAllTeamSlugs } from "@/lib/team-data";
import { TeamMemberClient } from "./TeamMemberClient";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};

  const title = `${member.name} — ${member.role} | AKAAR 3D`;
  const description = member.bio.slice(0, 160).trimEnd();
  const imageUrl = member.image.startsWith("/")
    ? `${BASE_URL}${member.image}`
    : member.image;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/team/${slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, alt: member.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function generateStaticParams() {
  return getAllTeamSlugs().map((slug) => ({ slug }));
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    notFound();
  }

  return <TeamMemberClient member={member} />;
}
