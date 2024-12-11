"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Textarea } from "@/components/ui/textarea";

import { LoadingButton } from "@/components/loading-button";
import { useCreateTreatment } from "../api/use-create-treatment";
import { TreatmentSchema, TreatmentSchemaType } from "../schemas";

export const TreatmentForm = () => {
    const { mutate: createTreatment, isPending } = useCreateTreatment();

    const form = useForm<TreatmentSchemaType>({
        resolver: zodResolver(TreatmentSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = (values: TreatmentSchemaType) => {
        createTreatment({ ...values });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Treatment Form</CardTitle>
                <CardDescription>
                    Please fill in the form below to add a new treatment.
                </CardDescription>
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

                        <LoadingButton
                            isLoading={isPending}
                            title="Create"
                            loadingTitle="Creating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};