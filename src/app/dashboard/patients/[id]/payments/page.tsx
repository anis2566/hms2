import { Metadata } from "next";

import { PaymentList } from "@/features/dashboard/patients/components/payment-list";

export const metadata: Metadata = {
    title: "Dashboard | Patient | Payments",
    description: "Payments for a patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const Payments = async ({ params }: Props) => {
    const { id } = (await params)
    return <PaymentList patientId={id} />

};

export default Payments;

