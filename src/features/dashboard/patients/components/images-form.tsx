"use client"

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import ImageUpload from "@/components/ui/image-upload";
import { LoadingButton } from "@/components/loading-button";
import { useUpdateImages } from "../api/use-update-images";
import { Patient } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const formSchema = z.object({
    files: z.array(z.instanceof(File)),
})

interface Props {
    patient: Patient;
}

export const ImagesForm = ({ patient }: Props) => {
    const [images, setImages] = useState<string[]>([])

    const handleDeleteImage = (url: string) => {
        console.log(images)
        console.log(images.filter(item => item !== url))
        // setImages((prevImages) => prevImages.filter((item) => item !== url));
    };

    useEffect(() => {
        if (patient?.images) {
            setImages([...patient.images]); // Ensure a fresh copy to avoid direct mutation
        }
    }, [patient]);


    const { mutate: updateImages, isPending } = useUpdateImages()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            files: []
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        updateImages({
            param: { id: patient.id },
            form: data
        })
    }

    return (
        <div>
            <div className="grid md:grid-cols-6 gap-6">
                {
                    images.map((image, index) => (
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
                                        multiple={true}
                                        onUploadComplete={field.onChange}
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