import { redirect } from 'next/navigation';

import { Sidebar } from '@/features/dashboard/patients/components/sidebar';
import { ContentLayout } from '@/features/dashboard/components/content-layout';
import { db } from '@/lib/db';

interface PatientLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>
}

const PatientLayout = async ({ children, params }: PatientLayoutProps) => {
    const { id } = await params;

    const patient = await db.patient.findUnique({
        where: {
            id: id
        }
    })

    if (!patient) redirect("/dashboard/patients")

    return (
        <ContentLayout title="Patient">
            {/* <BackButton /> */}
            <div className="flex gap-x-4">
                <div className="flex-shrink-0 md:w-[280px]">
                    <Sidebar patient={patient} patientId={id} />
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </ContentLayout>
    )
}

export default PatientLayout