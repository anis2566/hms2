"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { DateTimePicker } from '@/components/ui/date-time-picker';

import { AppointmentSchema, AppointmentSchemaType } from "../schemas";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LoadingButton } from "@/components/loading-button";
import { SimpleTimePicker } from "@/components/ui/time-picker";

export const AppointmentForm = () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    const form = useForm<AppointmentSchemaType>({
        resolver: zodResolver(AppointmentSchema),
        defaultValues: {
            purpose: "",
            description: "",
            patientId: "",
            doctorId: "",
            date: undefined,
            startTime: undefined,
            endTime: undefined,
            status: undefined,
        },
    });

    const onSubmit = (data: AppointmentSchemaType) => {
        console.log(data);
    }

    console.log(form.getValues("startTime"));

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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purpose of Appointment</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
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
                                            onDayClick={field.onChange}
                                            hideTime={true}
                                            disabled={new Date() > field.value}
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
                                        <SimpleTimePicker
                                            value={field.value || new Date()}
                                            onChange={field.onChange}
                                            use12HourFormat={true}
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
                                        <SimpleTimePicker
                                            value={field.value || new Date()}
                                            onChange={field.onChange}
                                            use12HourFormat={true}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Submit"
                            loadingTitle="Submitting..."
                            isLoading={false}
                            onClick={() => form.handleSubmit(onSubmit)}
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}