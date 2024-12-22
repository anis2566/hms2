"use client"

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2 } from "lucide-react";
import { Patient } from "@prisma/client";
import Image from "next/image";
import { useEffect } from "react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import ImageUpload from "@/components/ui/image-upload";
import { LoadingButton } from "@/components/loading-button";
import { useUpdateImages } from "../api/use-update-images";

export const formSchema = z.object({
    files: z.array(z.string()).optional(),
    existingFils: z.array(z.string())
})

interface Props {
    patient: Patient;
}

export const ImagesForm = ({ patient }: Props) => {
    const handleDeleteImage = (url: string) => {
        form.setValue("existingFils", form.getValues("existingFils").filter(item => item !== url))
    };

    useEffect(() => {
        if (patient?.images) {
            form.setValue("existingFils", [...patient.images])
        }
    }, [patient]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            files: [],
            existingFils: patient.images || []
        },
    });

    const { mutate: updateImages, isPending } = useUpdateImages({ form })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        updateImages({
            param: { id: patient.id },
            json: data
        })
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-6 gap-6">
                {
                    form.watch("existingFils")?.map((image, index) => (
                        <div className="aspect-square relative border p-2 rounded-md" key={index}>
                            <Image src={image} alt={image} fill className="object-contain h-[150px] p-2" />
                            <Button className="absolute right-0 top-0" size="icon" variant="destructive" onClick={() => handleDeleteImage(image)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                }
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUpload
                                        values={field.value || []}
                                        multiple={true}
                                        onUploadComplete={values => field.onChange(values)}
                                        name={patient.id}
                                        path="patients"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <LoadingButton
                        type="submit"
                        title="Update"
                        loadingTitle="Updating..."
                        isLoading={isPending}
                        onClick={() => form.handleSubmit(onSubmit)}
                        icon={Send}
                    />
                </form>
            </Form>
        </div>
    )
}