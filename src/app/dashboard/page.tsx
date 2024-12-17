import { Metadata } from "next";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { db } from "@/lib/db";

export const metadata: Metadata = {
    title: "TomarSports | Dashboard",
    description: "TomarSports Dashboard",
};

const Dashboard = async () => {
    // await db.appointment.deleteMany()
    return (
        <ContentLayout title="Dashboard">
            <div className="w-full">
                <h1>Dashboard</h1>
            </div>
        </ContentLayout>
    )
};

export default Dashboard;