"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Payment } from "@prisma/client";


import {
    Card,
    CardHeader,
    CardTitle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
    ;
import { PaymentSchema, PaymentSchemaType } from "../schema";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/constant";
import { LoadingButton } from "@/components/loading-button";
import { useUpdatePayment } from "../api/use-update-payment";
import { useSearchParams } from "next/navigation";

interface Props {
    payment: Payment;
}

export const EditPaymentForm = ({ payment }: Props) => {
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get("redirectUrl")

    const { mutate: updatePayment, isPending } = useUpdatePayment({ redirectUrl: redirectUrl ? redirectUrl : undefined })

    const form = useForm<PaymentSchemaType>({
        resolver: zodResolver(PaymentSchema),
        defaultValues: {
            patientId: payment.patientId,
            amount: payment.amount,
            method: payment.method,
            status: payment.status as PAYMENT_STATUS
        },
    });

    const onSubmit = (values: PaymentSchemaType) => {
        updatePayment({
            param: { id: payment.id },
            json: values
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Payment</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(PAYMENT_METHOD).map(method => (
                                                    <SelectItem key={method} value={method}>{method}</SelectItem>
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(PAYMENT_STATUS).map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
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
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}