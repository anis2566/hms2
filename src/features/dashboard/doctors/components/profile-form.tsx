"use client"

import { Doctor } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { DoctorSchema, DoctorSchemaType } from "../schemas";
import { TITLE } from "@/constant";
import { LoadingButton } from "@/components/loading-button";
import ImageUpload from "@/components/ui/image-upload";
import { useUpdateDoctor } from "../api/use-update-doctor";

interface Props {
    doctor: Doctor
}

export const ProfileForm = ({ doctor }: Props) => {
    const [isEdiImage, setIsEditImage] = useState<boolean>(true)

    const { mutate: updateProfile, isPending } = useUpdateDoctor({ redirectUrl: `/dashboard/doctors/${doctor.id}` })

    const form = useForm<DoctorSchemaType>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: doctor.name,
            email: doctor.email || "",
            title: doctor.title as TITLE,
            phone: doctor.phone,
            address: doctor.address,
            password: doctor.password,
            imageUrl: doctor.imageUrl || "",
        },
    });

    const onSubmit = (values: DoctorSchemaType) => {
        updateProfile({
            param: { id: doctor.id },
            json: {
                ...values,
            }
        })
    };

    console.log(form.formState.errors)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Doctor Profile</CardTitle>
                <CardDescription>
                    Customize doctor profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        {
                                            isEdiImage && doctor.imageUrl ? (
                                                <div className="relative">
                                                    <div className="relative aspect-square max-h-[100px]">
                                                        <Image src={doctor.imageUrl} alt="Profile" fill className="object-contain rounded-full" />
                                                    </div>
                                                    <Button type="button" variant="destructive" className="absolute right-0 top-0" onClick={() => setIsEditImage(false)}>
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <ImageUpload values={field.value ? [field.value] : []} onUploadComplete={value => field.onChange(value[0])} disabled={false} multiple={true} path="patients" name="Patient" />
                                            )
                                        }
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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