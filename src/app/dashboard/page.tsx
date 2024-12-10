import { Metadata } from "next";

import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "TomarSports | Dashboard",
    description: "TomarSports Dashboard",
};

const Dashboard = () => {
    return (
        <ContentLayout title="Dashboard">
            <div className="w-full">
                <h1>Dashboard</h1>
            </div>
        </ContentLayout>
    )
};

export default Dashboard;