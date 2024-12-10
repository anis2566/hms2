import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
    return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
