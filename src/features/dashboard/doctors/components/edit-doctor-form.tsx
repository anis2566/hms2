"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2 } from "lucide-react";
import { Doctor } from "@prisma/client";
import { useState, useEffect } from "react";
import Image from "next/image";

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
import { Button } from "@/components/ui/button";

import { LoadingButton } from "@/components/loading-button";
import { DoctorSchemaTypeWithoutImage, DoctorSchemaWithoutImage } from "../schemas";
import { TITLE } from "@/constant";
import { useUpdateDoctor } from "../api/use-update-doctor";
import FileUpload from "@/components/ui/file-upload";
import { useUpdateDoctorWithImage } from "../api/use-update-doctor-with-image";

interface EditDoctorFormProps {
    doctor: Doctor
}

export const EditDoctorForm = ({ doctor }: EditDoctorFormProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const { mutate: updateDoctor, isPending } = useUpdateDoctor();
    const { mutate: updateDoctorWithImage, isPending: isPendingWithImage } = useUpdateDoctorWithImage();

    useEffect(() => {
        if (doctor.imageUrl) {
            setImageUrl(doctor.imageUrl);
        }
    }, [doctor.imageUrl]);

    const form = useForm<DoctorSchemaTypeWithoutImage>({
        resolver: zodResolver(DoctorSchemaWithoutImage),
        defaultValues: {
            name: doctor.name,
            title: doctor.title,
            email: doctor.email,
            phone: doctor.phone,
            address: doctor.address,
            imageUrl: undefined,
            password: doctor.password,
        },
    });

    const onSubmit = (values: DoctorSchemaTypeWithoutImage) => {
        if (values.imageUrl) {
            updateDoctorWithImage({
                param: { id: doctor.id },
                form: {
                    name: values.name,
                    title: values.title,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                    password: values.password,
                    imageUrl: values.imageUrl,
                },
            });
        } else {
            updateDoctor({
                param: { id: doctor.id },
                form: {
                    name: values.name,
                    title: values.title,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                    password: values.password,
                },
            });
        }
    }

    console.log(form.formState.errors);

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
                                        <Input {...field} disabled={isPending || isPendingWithImage} />
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || isPendingWithImage}>
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
                                        <Input {...field} disabled={isPending || isPendingWithImage} />
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
                                        <Input {...field} disabled={isPending || isPendingWithImage} />
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
                                        <Textarea {...field} disabled={isPending || isPendingWithImage} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    {
                                        imageUrl ? (
                                            <div className="relative">
                                                <div className="w-full aspect-square relative max-h-[100px]">
                                                    <Image src={imageUrl} alt="Doctor Image" fill className="object-contain" />
                                                </div>
                                                <Button disabled={isPending || isPendingWithImage} type="button" variant="destructive" size="icon" onClick={() => setImageUrl(null)} className="absolute top-0 right-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <FileUpload
                                                    title="Upload Image"
                                                    acceptedFileTypes={["image/jpeg", "image/png", "image/jpg"]}
                                                    multiple={false}
                                                    maxSizeInMB={5}
                                                    onUploadComplete={field.onChange}
                                                />
                                            </FormControl>
                                        )
                                    }
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending || isPendingWithImage}
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