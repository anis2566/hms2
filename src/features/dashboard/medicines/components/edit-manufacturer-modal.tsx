"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { useUpdateManufacturer } from "@/hooks/use-manufacturer"
import { ManufacturerSchemaType, ManufacturerSchema } from "@/features/dashboard/medicines/schemas"
import { LoadingButton } from "@/components/loading-button"
import { useUpdateManufacturer as useUpdateManufacturerApi } from "@/features/dashboard/medicines/api/use-update-manufacturer"
import ImageUpload from "@/components/ui/image-upload"

export const EditManufacturerModal = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    const { isOpen, onClose, manufacturer, id } = useUpdateManufacturer()

    const { mutate: updateManufacturer, isPending } = useUpdateManufacturerApi({ onClose })

    useEffect(() => {
        if (manufacturer) {
            form.reset({
                name: manufacturer.name,
                description: manufacturer.description || "",
                imageUrl: manufacturer.imageUrl || "",
            })
            setImageUrl(manufacturer.imageUrl)
        }
    }, [manufacturer])

    const form = useForm<ManufacturerSchemaType>({
        resolver: zodResolver(ManufacturerSchema),
        defaultValues: {
            name: manufacturer?.name || "",
            description: manufacturer?.description || "",
            imageUrl: manufacturer?.imageUrl || '',
        },
    })

    const onSubmit = (data: ManufacturerSchemaType) => {
        updateManufacturer({
            json: data,
            param: { id }
        })
    }

    return (
        <Dialog open={isOpen && !!manufacturer && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Manufacturer</DialogTitle>
                    <DialogDescription>Edit a manufacturer</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={isPending} />
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
                                                    <Image src={imageUrl} alt="Manufacturer Image" fill className="object-contain" />
                                                </div>
                                                <Button disabled={isPending} type="button" variant="destructive" size="icon" onClick={() => setImageUrl(null)} className="absolute top-0 right-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <ImageUpload values={field.value ? [field.value] : []} onUploadComplete={value => field.onChange(value[0])} disabled={false} multiple={true} path="patients" name="Patient" />
                                            </FormControl>
                                        )
                                    }
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending}
                            title="Update"
                            loadingTitle="Updating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            className="w-full"
                            icon={Send}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}