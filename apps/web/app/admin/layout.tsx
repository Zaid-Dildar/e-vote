import Sidebar from "@components/Sidebar";
import Header from "@components/Header";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar type="admin" />

      {/* Main Content */}
      <div className="flex-1 xl:ml-64">
        <Header />
        <main className="flex-1 max-w-screen p-4">{children}</main>
      </div>
    </div>
  );
}
