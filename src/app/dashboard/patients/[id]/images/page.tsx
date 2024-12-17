import { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ImagesForm } from "@/features/dashboard/patients/components/images-form";

export const metadata: Metadata = {
    title: "Dashboard | Patient | Images",
    description: "Profile for a patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const Images = async ({ params }: Props) => {
    const { id } = (await params)

    const patient = await db.patient.findUnique({
        where: {
            id
        }
    })

    if (!patient) redirect("/dashboard/patients")

    return (
        <div className="space-y-6">
            <ImagesForm patient={patient} />
            {/* <ProfileForm patient={patient} /> */}
        </div>
    )
};

export default Images;

