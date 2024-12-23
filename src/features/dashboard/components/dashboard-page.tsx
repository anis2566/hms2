"use client"

import { Calendar, DollarSign, Pill, Users } from "lucide-react";

import { EarningCard } from "./earning-card";
import { RecentAppoinments } from "./recent-appointments";
import { RecentPatients } from "./recent-patients";
import { RecentTransactions } from "./recent-payments";
import { StatCard } from "./stat-card";
import { useGetDashboardData } from "../api/use-get-dashboard-data";


export const DashboardPage = () => {
    const { data, isLoading } = useGetDashboardData();

    return (
        <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                    icon={Users}
                    title="Total Patients"
                    value={data?.currentMonthPatients || 0}
                    percentage={data?.patientPercentage || 0}
                    bgColor="bg-sky-500/10"
                    textColor="text-sky-500"
                    chartData={data?.patientsChartData || []}
                    isLoading={isLoading}
                />
                <StatCard
                    icon={Calendar}
                    title="Appointments"
                    value={data?.currentMonthAppointments || 0}
                    percentage={data?.appointmentPercentage || 0}
                    bgColor="bg-amber-500/10"
                    textColor="text-amber-500"
                    chartData={data?.appointmentsChartData || []}
                    isLoading={isLoading}
                />
                <StatCard
                    icon={Pill}
                    title="Prescriptions"
                    value={data?.currentMonthMedicalRecords || 0}
                    percentage={data?.medicalRecordPercentage || 0}
                    bgColor="bg-indigo-500/10"
                    textColor="text-indigo-500"
                    chartData={data?.medicalRecordsChartData || []}
                    isLoading={isLoading}
                />
                <StatCard
                    icon={DollarSign}
                    title="Total Earnings"
                    value={data?.currentMonthRevenue || 0}
                    percentage={data?.revenuePercentage || 0}
                    bgColor="bg-green-500/10"
                    textColor="text-green-500"
                    chartData={data?.revenueChartData || []}
                    isLoading={isLoading}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <EarningCard chartData={data?.revenueChartData || []} percentage={data?.revenuePercentage || 0} />
                <RecentPatients />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <RecentTransactions />
                <RecentAppoinments />
            </div>
        </div>
    )
};