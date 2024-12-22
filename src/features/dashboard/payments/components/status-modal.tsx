"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useEffect } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { usePaymentStatus } from "@/hooks/use-payment"
import { LoadingButton } from "@/components/loading-button"
import { PAYMENT_STATUS } from "@/constant"
import { useUpdatePaymentStatus } from "../api/use-update-status"

const formSchema = z.object({
    status: z
        .nativeEnum(PAYMENT_STATUS)
        .refine((value) => Object.values(PAYMENT_STATUS).includes(value), {
            message: "required",
        }),
})

export const PaymentStatusModal = () => {
    const { isOpen, id, status, onClose } = usePaymentStatus()

    const { mutate: updateStatus, isPending } = useUpdatePaymentStatus({ onClose })

    useEffect(() => {
        if (isOpen) {
            form.reset({
                status: status,
            })
        }
    }, [isOpen, status])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: status
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await updateStatus({
            json: {
                status: values.status,
            },
            param: {
                id: id,
            },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Status</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(PAYMENT_STATUS).map((status) => (
                                                <SelectItem key={status} value={status} className="capitalize">{status.toLowerCase()}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
            </DialogContent>
        </Dialog>
    )
}

