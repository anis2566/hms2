"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { TimePicker } from "@/components/ui/time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AppointmentSchema, AppointmentSchemaType } from "../schemas";
import { LoadingButton } from "@/components/loading-button";
import { useGetDoctorsForSelect } from "../../patients/api/use-get-doctors-for-select";
import { useGetServicesForSelect } from "../api/use-get-services-for-select";
import { useGetPatientsForSelect } from "../api/use-get-patients-for-select";
import { APPOINTMENT_STATUS } from "@/constant";
import { useCreateAppointment } from "../api/use-create-appointment";

export const AppointmentForm = () => {
    const { data: services, isLoading: isServicesLoading } = useGetServicesForSelect();
    const { data: patients, isLoading: isPatientsLoading } = useGetPatientsForSelect();
    const { data, isLoading: isDoctorsLoading } = useGetDoctorsForSelect();

    const { mutate: createAppointment, isPending } = useCreateAppointment({ redirectUrl: undefined })

    const form = useForm<AppointmentSchemaType>({
        resolver: zodResolver(AppointmentSchema),
        defaultValues: {
            serviceId: "",
            description: "",
            patientId: "",
            doctorId: "",
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            status: APPOINTMENT_STATUS.PENDING,
        },
    });

    const onSubmit = (data: AppointmentSchemaType) => {
        createAppointment({
            ...data,
            date: data.date.toISOString(),
            startTime: data.startTime.toISOString(),
            endTime: data.endTime.toISOString(),
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointment Form</CardTitle>
                <CardDescription>
                    Please fill in the form to create a new appointment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 items-center gap-6">
                        <FormField
                            control={form.control}
                            name="patientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patient</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPatientsLoading || isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a patient" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {patients?.patients.map((patient) => (
                                                <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purpose of Appointment</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isServicesLoading || isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a purpose" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {services?.services.map((service) => (
                                                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="doctorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Doctor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDoctorsLoading || isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a doctor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data?.doctors.map((doctor) => (
                                                <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Appointment</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            value={field.value || new Date()}
                                            onChange={field.onChange}
                                            onDayClick={value => field.onChange(new Date(value))}
                                            hideTime={true}
                                            disabled={new Date() > field.value || isPending}
                                            min={new Date()}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(APPOINTMENT_STATUS).map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Submit"
                            loadingTitle="Submitting..."
                            isLoading={isPending}
                            onClick={() => form.handleSubmit(onSubmit)}
                            className="max-w-fit"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}