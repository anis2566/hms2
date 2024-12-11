"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Treatment } from "@prisma/client";

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
import { useUpdateTreatment } from "../api/use-update-treatment";
import { TreatmentSchema, TreatmentSchemaType } from "../schemas";

interface EditTreatmentFormProps {
    treatment: Treatment;
}

export const EditTreatmentForm = ({ treatment }: EditTreatmentFormProps) => {
    const { mutate: updateTreatment, isPending } = useUpdateTreatment();

    const form = useForm<TreatmentSchemaType>({
        resolver: zodResolver(TreatmentSchema),
        defaultValues: {
            name: treatment.name,
            description: treatment.description,
        },
    });

    const onSubmit = (values: TreatmentSchemaType) => {
        updateTreatment({ json: values, param: { id: treatment.id } });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Treatment</CardTitle>
                <CardDescription>
                    Please fill in the form below to edit a treatment.
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
    );
};