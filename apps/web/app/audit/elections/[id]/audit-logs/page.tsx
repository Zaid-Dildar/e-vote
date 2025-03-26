import AuditLogs from "@components/audit/AuditLogs";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;
  return <AuditLogs electionId={electionId} />;
}
