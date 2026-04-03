import { notFound } from "next/navigation";
import { getTeamMember, getAllTeamSlugs } from "@/lib/team-data";
import { TeamMemberClient } from "./TeamMemberClient";

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
