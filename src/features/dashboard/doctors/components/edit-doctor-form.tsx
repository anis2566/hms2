"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Doctor } from "@prisma/client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { LoadingButton } from "@/components/loading-button";
import { DoctorSchema, DoctorSchemaType } from "../schemas";
import { TITLE } from "@/constant";
import { useUpdateDoctor } from "../api/use-update-doctor";

interface EditDoctorFormProps {
    doctor: Doctor
}

export const EditDoctorForm = ({ doctor }: EditDoctorFormProps) => {

    const { mutate: updateDoctor, isPending } = useUpdateDoctor();

    const form = useForm<DoctorSchemaType>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: doctor.name,
            title: doctor.title,
            email: doctor.email,
            phone: doctor.phone,
            address: doctor.address,
            imageUrl: doctor.imageUrl ?? undefined,
            password: doctor.password ?? undefined,
        },
    });

    const onSubmit = (values: DoctorSchemaType) => {
        updateDoctor({ json: values, param: { id: doctor.id } });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Doctor</CardTitle>
                <CardDescription>Edit a doctor to the system</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a title" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(TITLE).map((title) => (
                                                    <SelectItem key={title} value={title}>{title}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending}
                            title="Create"
                            loadingTitle="Creating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}