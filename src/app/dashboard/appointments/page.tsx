import { Metadata } from "next";
import Link from "next/link";
import {endOfMonth, getDaysInMonth, startOfMonth} from "date-fns"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { AppointmentList } from "@/features/dashboard/appointments/components/appointment-list";
import { db } from "@/lib/db";
import { Appointment, Patient, Service } from "@prisma/client";

interface AppointmentWithRelation extends Appointment {
    patient: Patient
    service: Service
}

type AppointmentData = {
  name: string;
  count: number;
  appointments: AppointmentWithRelation[];
};

type AppointmentsByDate = {
    date: string
    count: number
    appointments: AppointmentData[]
}[]

export const metadata: Metadata = {
    title: "Dashboard | Appointments",
    description: "Appointments page",
};

const Appointments = async () => {
    const startMonth = startOfMonth(new Date())
    const endMonth = endOfMonth(new Date())

    const appointments = await db.appointment.findMany({
        where: {
            updatedAt: {
                gte: startMonth,
                lte: endMonth
            }
        },
        include: {
            doctor: true,
            patient: true,
            service: true
        }
    })


const appointmentDetailsByDate: AppointmentsByDate = appointments.reduce((acc, item) => {
    const date = item.updatedAt.toLocaleDateString("en-US");
    const doctorName = item.doctor?.name;

    if (!doctorName) return acc;

    let dateEntry = acc.find((entry) => entry.date === date);

    if (!dateEntry) {
      dateEntry = {
        date,
        count: 0,
        appointments: [],
      };
      acc.push(dateEntry);
    }

    let doctorEntry = dateEntry.appointments.find((entry) => entry.name === doctorName);

    if (doctorEntry) {
      doctorEntry.count += 1;
      doctorEntry.appointments.push(item);
    } else {
      dateEntry.appointments.push({
        name: doctorName,
        count: 1,
        appointments: [item],
      });
    }

    dateEntry.count += 1;

    return acc;
  }, [] as AppointmentsByDate);

    
    const appointmentDaybyDay = Array.from({ length: getDaysInMonth(new Date()) }, (_, index) => {
        const arrayDate = new Date(new Date().getFullYear(), new Date().getMonth(), index + 1).toLocaleDateString("en-US")
        const day = appointmentDetailsByDate.find((entry) => entry.date === arrayDate)
        
        if (!day) {
            return {
                date: arrayDate,
                count: 0,
                appointments: []
            }
        }
        return day
    })

    return (
        <ContentLayout title="Appointments">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Appointments</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <AppointmentList appointmentsByDay={appointmentDaybyDay} />
        </ContentLayout>
    )
};

export default Appointments;

