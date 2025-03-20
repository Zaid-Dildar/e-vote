import Sidebar from "@components/Sidebar";
import Header from "@components/Header";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar type="auditor" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
