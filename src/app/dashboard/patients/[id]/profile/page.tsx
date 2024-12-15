import { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ProfileForm } from "@/features/dashboard/patients/components/profile-form";

export const metadata: Metadata = {
    title: "Dashboard | Patient | Profile",
    description: "Profile for a patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const Profile = async ({ params }: Props) => {
    const { id } = (await params)

    const patient = await db.patient.findUnique({
        where: {
            id
        }
    })

    if (!patient) redirect("/dashboard/patients")

    return (
        <div className="space-y-6">
            <ProfileForm patient={patient} />
        </div>
    )
};

export default Profile;

