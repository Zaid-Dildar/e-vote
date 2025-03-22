import AuditLogs from "@components/admin/AuditLogs";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;
  return <AuditLogs electionId={electionId} />;
}
