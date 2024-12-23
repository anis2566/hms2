import { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/dashboard/doctors/components/profile-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | Doctor | Profile",
  description: "Profile for a doctor",
};

interface Props {
  params: Promise<{ id: string }>
}


const Doctor = async ({ params }: Props) => {
  const { id } = (await params)

  const doctor = await db.doctor.findUnique({
    where: {
      id
    }
  })

  if (!doctor) redirect("/dashboard/doctors")

  return (
    <div>
      <ProfileForm doctor={doctor} />
    </div>
  )
}

export default Doctor
