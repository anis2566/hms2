import { Metadata } from "next";

import { PasswordForm } from "@/features/dashboard/doctors/components/password-form";

export const metadata: Metadata = {
    title: "Dashboard | Doctor | Patients",
    description: "Patients of Doctor",
};

interface Props {
    params: Promise<{ id: string }>
}


const ChangePassword = async ({ params }: Props) => {
    const { id } = (await params)
    return <PasswordForm doctorId={id} />

};

export default ChangePassword;

