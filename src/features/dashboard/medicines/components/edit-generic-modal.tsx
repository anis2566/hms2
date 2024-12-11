"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"
import { useEffect } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useUpdateGeneric } from "@/hooks/use-generic"
import { GenericSchema, GenericSchemaType } from "@/features/dashboard/medicines/schemas"
import { LoadingButton } from "@/components/loading-button"
import { useUpdateGeneric as useUpdateGenericApi } from "@/features/dashboard/medicines/api/use-update-generic"

export const EditGenericModal = () => {
    const { isOpen, onClose, generic, id } = useUpdateGeneric()

    const { mutate: updateGeneric, isPending } = useUpdateGenericApi({ onClose })

    useEffect(() => {
        if (generic) {
            form.reset({
                name: generic.name,
                description: generic.description || "",
            })
        }
    }, [generic])

    const form = useForm<GenericSchemaType>({
        resolver: zodResolver(GenericSchema),
        defaultValues: {
            name: generic?.name || "",
            description: generic?.description || "",
        },
    })

    const onSubmit = (data: GenericSchemaType) => {
        updateGeneric({ param: { id }, json: data })
    }

    return (
        <Dialog open={isOpen && !!generic && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Generic</DialogTitle>
                    <DialogDescription>Edit a generic medicine</DialogDescription>
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