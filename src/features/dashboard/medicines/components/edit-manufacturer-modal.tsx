"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"
import { useEffect } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useUpdateManufacturer } from "@/hooks/use-manufacturer"
import { ManufacturerSchema, ManufacturerSchemaType } from "@/features/dashboard/medicines/schemas"
import { LoadingButton } from "@/components/loading-button"
import { useUpdateManufacturer as useUpdateManufacturerApi } from "@/features/dashboard/medicines/api/use-update-manufacturer"

export const EditManufacturerModal = () => {
    const { isOpen, onClose, manufacturer, id } = useUpdateManufacturer()

    const { mutate: updateManufacturer, isPending } = useUpdateManufacturerApi({ onClose })

    useEffect(() => {
        if (manufacturer) {
            form.reset({
                name: manufacturer.name,
                description: manufacturer.description || "",
            })
        }
    }, [manufacturer])

    const form = useForm<ManufacturerSchemaType>({
        resolver: zodResolver(ManufacturerSchema),
        defaultValues: {
            name: manufacturer?.name || "",
            description: manufacturer?.description || "",
        },
    })

    const onSubmit = (data: ManufacturerSchemaType) => {
        updateManufacturer({ param: { id }, json: data })
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