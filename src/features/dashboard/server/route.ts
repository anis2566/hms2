import { Hono } from "hono";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { APPOINTMENT_STATUS, MONTHS, PAYMENT_STATUS } from "@/constant";

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        isAdmin,
        async (c) => {
            const startDate = startOfMonth(new Date());
            const endDate = endOfMonth(new Date());
            const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
            const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));

            const [currentMonthPatients, previousMonthPatients, currentMonthAppointments, previousMonthAppointments, currentMonthMedicalRecords, previousMonthMedicalRecords, totalRevenue, currentMonthRevenue, previousMonthRevenue, patientsByMonth, appointmentsByMonth, medicalRecordsByMonth, revenueByMonth] = await Promise.all([
                db.patient.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                }),
                db.patient.count({
                    where: {
                        createdAt: {
                            gte: previousMonthStart,
                            lte: previousMonthEnd,
                        },
                    },
                }),
                db.appointment.count({
                    where: {
                        status: APPOINTMENT_STATUS.COMPLETED,
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                }),
                db.appointment.count({
                    where: {
                        status: APPOINTMENT_STATUS.COMPLETED,
                        createdAt: {
                            gte: previousMonthStart,
                            lte: previousMonthEnd,
                        },
                    },
                }),
                db.medicalRecord.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                }),
                db.medicalRecord.count({
                    where: {
                        createdAt: {
                            gte: previousMonthStart,
                            lte: previousMonthEnd,
                        },
                    },
                }),
                db.payment.aggregate({
                    where: {
                        status: PAYMENT_STATUS.PAID,
                    },
                    _sum: {
                        amount: true,
                    },
                }),
                db.payment.aggregate({
                    where: {
                        status: PAYMENT_STATUS.PAID,
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                }),
                db.payment.aggregate({
                    where: {
                        status: PAYMENT_STATUS.PAID,
                        createdAt: {
                            gte: previousMonthStart,
                            lte: previousMonthEnd,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                }),
                db.patient.groupBy({
                    by: ["createdAt"],
                    _count: {
                        _all: true,
                    },
                }),
                db.appointment.groupBy({
                    by: ["createdAt"],
                    _count: {
                        _all: true,
                    },
                }),
                db.medicalRecord.groupBy({
                    by: ["createdAt"],
                    _count: {
                        _all: true,
                    },
                }),
                db.payment.groupBy({
                    by: ["createdAt"],
                    where: {
                        status: PAYMENT_STATUS.PAID,
                    },
                    _sum: {
                        amount: true,
                    },
                }),
            ]);

            let patientPercentage = 0;
            if (previousMonthPatients > 0) {
                patientPercentage =
                    ((currentMonthPatients - previousMonthPatients) /
                        previousMonthPatients) *
                    100;
            } else if (currentMonthPatients > 0) {
                patientPercentage = 100;
            }

            let appointmentPercentage = 0;
            if (previousMonthAppointments > 0) {
                appointmentPercentage =
                    ((currentMonthAppointments - previousMonthAppointments) /
                        previousMonthAppointments) *
                    100;
            } else if (currentMonthAppointments > 0) {
                appointmentPercentage = 100;
            }

            let medicalRecordPercentage = 0;
            if (previousMonthMedicalRecords > 0) {
                medicalRecordPercentage =
                    ((currentMonthMedicalRecords - previousMonthMedicalRecords) /
                        previousMonthMedicalRecords) *
                    100;
            } else if (currentMonthMedicalRecords > 0) {
                medicalRecordPercentage = 100;
            }

            let revenuePercentage = 0;

            if (previousMonthRevenue?._sum?.amount && previousMonthRevenue?._sum?.amount > 0) {
                revenuePercentage =
                    ((currentMonthRevenue?._sum?.amount || 0) -
                        (previousMonthRevenue?._sum?.amount || 0)) /
                    (previousMonthRevenue?._sum?.amount || 0) *
                    100;
            } else if (currentMonthRevenue?._sum?.amount && currentMonthRevenue?._sum?.amount > 0) {
                revenuePercentage = 100;
            }

            const currentMonthIndex = new Date().getMonth();
            const monthsToInclude = 6;

            const months = Array.from({ length: monthsToInclude }, (_, i) => {
                const monthIndex = currentMonthIndex - i;
                const month = (monthIndex + 12) % 12;
                return new Date(new Date().setMonth(month));
            });

            const patientsChartData = months.map((date) => {
                const patientCount = patientsByMonth
                    .filter(
                        (record) =>
                            new Date(record.createdAt).getMonth() === date.getMonth() &&
                            new Date(record.createdAt).getFullYear() === date.getFullYear()
                    )
                    .reduce((total, record) => total + record._count._all, 0);

                const monthName = date.toLocaleString('default', { month: 'short' });

                return { month: monthName, count: patientCount };
            }).reverse();

            const medicalRecordsChartData = months.map((date) => {
                const medicalRecordCount = medicalRecordsByMonth
                    .filter(
                        (record) =>
                            new Date(record.createdAt).getMonth() === date.getMonth() &&
                            new Date(record.createdAt).getFullYear() === date.getFullYear()
                    )
                    .reduce((total, record) => total + record._count._all, 0);

                const monthName = date.toLocaleString('default', { month: 'short' });

                console.log(medicalRecordCount);

                return { month: monthName, count: medicalRecordCount };
            }).reverse();

            const appointmentsChartData = months.map((date) => {
                const appointmentCount = appointmentsByMonth
                    .filter(
                        (record) =>
                            new Date(record.createdAt).getMonth() === date.getMonth() &&
                            new Date(record.createdAt).getFullYear() === date.getFullYear()
                    )
                    .reduce((total, record) => total + record._count._all, 0);

                const monthName = date.toLocaleString('default', { month: 'short' });

                return { month: monthName, count: appointmentCount };
            }).reverse();

            const revenueChartData = Object.values(MONTHS).map((month, index) => {
                const count = revenueByMonth
                    .filter(
                        (record) =>
                            new Date(record.createdAt).getMonth() === index
                    )
                    .reduce((total, record) => total + (record._sum.amount || 0), 0);
                return { month, count };
            });

            return c.json({ currentMonthPatients, patientPercentage, currentMonthAppointments, appointmentPercentage, currentMonthMedicalRecords, medicalRecordPercentage, totalRevenue: totalRevenue?._sum?.amount || 0, currentMonthRevenue: currentMonthRevenue?._sum?.amount || 0, revenuePercentage, patientsChartData, appointmentsChartData, medicalRecordsChartData, revenueChartData });
        }
    )
    .get(
        "/recentPatients",
        sessionMiddleware,
        isAdmin,
        async (c) => {
            const recentPatients = await db.patient.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            });
            return c.json(recentPatients);
        }
    )
    .get(
        "/recentTransactions",
        sessionMiddleware,
        isAdmin,
        async (c) => {
            const transactions = await db.payment.findMany({
                include: {
                    patient: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            });
            return c.json(transactions);
        }
    )
    .get(
        "/recentAppointments",
        sessionMiddleware,
        isAdmin,
        async (c) => {
            const appointments = await db.appointment.findMany({
                include: {
                    patient: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 4,
            });
            return c.json(appointments);
        }
    );

export default app;
