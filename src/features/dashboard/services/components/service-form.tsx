"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ServiceSchema, ServiceSchemaType } from "@/features/dashboard/services/schemas";
import { SERVICE_STATUS } from "@/constant";
import { LoadingButton } from "@/components/loading-button";
import { useCreateService } from "../api/use-create-service";

export const ServiceForm = () => {
    const { mutate, isPending } = useCreateService();

    const form = useForm<ServiceSchemaType>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            name: "",
            price: 0,
            description: "",
            status: undefined,
        },
    });

    const onSubmit = (data: ServiceSchemaType) => {
        mutate(data);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Service</CardTitle>
                <CardDescription>Create a new service</CardDescription>
            </CardHeader>
            <CardContent>
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                    </FormControl>
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
                                    <Select onValueChange={value => field.onChange(value)} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(SERVICE_STATUS).map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Create"
                            loadingTitle="Creating..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}