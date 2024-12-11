"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Medicine } from "@prisma/client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { MedicineSchema, MedicineSchemaType } from "../schemas";
import { LoadingButton } from "@/components/loading-button";
import { useUpdateMedicine } from "../api/use-update-medicine";
import { useGetGenericsForSelect } from "../api/use-get-generics-for-select";
import { useGetManufacturersForSelect } from "../api/use-get-manufacturers-for-select";

interface EditMedicineFormProps {
    medicine: Medicine
}

export const EditMedicineForm = ({ medicine }: EditMedicineFormProps) => {
    const { data, isLoading: isGenericsLoading } = useGetGenericsForSelect();
    const { data: dataManufacturers, isLoading: isManufacturersLoading } = useGetManufacturersForSelect();

    const { mutate: updateMedicine, isPending } = useUpdateMedicine();

    const form = useForm<MedicineSchemaType>({
        resolver: zodResolver(MedicineSchema),
        defaultValues: {
            name: medicine.name,
            description: medicine.description || "",
            sideEffects: medicine.sideEffects || "",
            price: medicine.price,
            genericId: medicine.genericId,
            manufacturerId: medicine.manufacturerId,
        },
    });

    const onSubmit = (values: MedicineSchemaType) => {
        updateMedicine({ json: values, param: { id: medicine.id } });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Medicine</CardTitle>
                <CardDescription>
                    Please fill in the form below to edit a medicine.
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

                        <FormField
                            control={form.control}
                            name="sideEffects"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Side Effects</FormLabel>
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
                                        <Input {...field} disabled={isPending} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="genericId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Generic</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isGenericsLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a generic" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data?.generics.map(generic => (
                                                <SelectItem key={generic.id} value={generic.id}>{generic.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="manufacturerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manufacturer</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isManufacturersLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a manufacturer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dataManufacturers?.manufacturers.map((manufacturer: { id: string; name: string }) => (
                                                <SelectItem key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</SelectItem>
                                            ))}
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
    );
};