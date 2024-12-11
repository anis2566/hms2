"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useCreateGeneric } from "@/hooks/use-generic"
import { GenericSchema, GenericSchemaType } from "@/features/dashboard/medicines/schemas"
import { LoadingButton } from "@/components/loading-button"
import { useCreateGeneric as useCreateGenericApi } from "@/features/dashboard/medicines/api/use-create-generic"

export const NewGenericModal = () => {
    const { isOpen, onClose } = useCreateGeneric()

    const { mutate: createGeneric, isPending } = useCreateGenericApi({ onClose })

    const form = useForm<GenericSchemaType>({
        resolver: zodResolver(GenericSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const onSubmit = (data: GenericSchemaType) => {
        createGeneric(data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Generic</DialogTitle>
                    <DialogDescription>Add a new generic medicine</DialogDescription>
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
                                        <Input {...field} disabled={isPending} autoFocus />
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