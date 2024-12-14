"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useCreateManufacturer } from "@/hooks/use-manufacturer"
import { ManufacturerSchemaTypeWithImage, ManufacturerSchemaWithImage } from "@/features/dashboard/medicines/schemas"
import { LoadingButton } from "@/components/loading-button"
import { useCreateManufacturer as useCreateManufacturerApi } from "@/features/dashboard/medicines/api/use-create-manufacturer"
import FileUpload from "@/components/ui/file-upload"
import { useCreateManufacturerWithImage } from "../api/use-create-manufacturer-with-image"

export const NewManufacturerModal = () => {
    const { isOpen, onClose } = useCreateManufacturer()

    const { mutate: createManufacturer, isPending } = useCreateManufacturerApi({ onClose })
    const { mutate: createManufacturerWithImage, isPending: isPendingWithImage } = useCreateManufacturerWithImage({ onClose })

    const form = useForm<ManufacturerSchemaTypeWithImage>({
        resolver: zodResolver(ManufacturerSchemaWithImage),
        defaultValues: {
            name: "",
            description: "",
            imageUrl: undefined,
        },
    })

    const onSubmit = (data: ManufacturerSchemaTypeWithImage) => {
        if (data.imageUrl) {
            createManufacturerWithImage({
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
            })
        } else {
            createManufacturer({
                name: data.name,
                description: data.description,
            })
        }
    }

    console.log(form.formState.errors)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Manufacturer</DialogTitle>
                    <DialogDescription>Add a new manufacturer</DialogDescription>
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
                                        <Input {...field} disabled={isPending || isPendingWithImage} autoFocus />
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
                                    <FormControl>
                                        <FileUpload
                                            title="Upload Image"
                                            onUploadComplete={(file) => {
                                                field.onChange(file)
                                            }}
                                            acceptedFileTypes={["image/jpeg", "image/png", "image/jpg"]}
                                            multiple={false}
                                            maxSizeInMB={5}
                                            className="max-w-[450px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending || isPendingWithImage}
                            title="Create"
                            loadingTitle="Creating..."
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