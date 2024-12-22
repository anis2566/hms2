import { redirect } from 'next/navigation';

import { ContentLayout } from '@/features/dashboard/components/content-layout';
import { db } from '@/lib/db';
import { Sidebar } from '@/features/dashboard/doctors/components/sidebar';

interface PatientLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>
}

const PatientLayout = async ({ children, params }: PatientLayoutProps) => {
    const { id } = await params;

    const doctor = await db.doctor.findUnique({
        where: {
            id: id
        }
    })

    if (!doctor) redirect("/dashboard/doctors")

    return (
        <ContentLayout title="Patient">
            {/* <BackButton /> */}
            <div className="flex gap-x-4">
                <div className="flex-shrink-0 md:w-[280px]">
                    <Sidebar doctor={doctor} doctorId={id} />
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </ContentLayout>
    )
}

export default PatientLayout