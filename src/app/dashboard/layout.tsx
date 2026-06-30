import DashboardSidebar from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream-50">
      <DashboardSidebar />
      {/* Content area offset by sidebar width on desktop */}
      <div className="lg:ml-60">
        {/* Top padding for mobile topbar */}
        <div className="pt-14 lg:pt-0">{children}</div>
      </div>
    </div>
  )
}
