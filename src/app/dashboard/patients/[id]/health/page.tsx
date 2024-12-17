import { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { HealthForm } from "@/features/dashboard/patients/components/health-form";

export const metadata: Metadata = {
    title: "Dashboard | Patient | Health",
    description: "Health for a patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const Health = async ({ params }: Props) => {
    const { id } = (await params)

    const patient = await db.patient.findUnique({
        where: {
            id
        },
        include: {
            health: true
        }
    })

    if (!patient) redirect("/dashboard/patients")

    return (
        <div className="space-y-6">
            <HealthForm patient={patient} />
        </div>
    )
};

export default Health;

