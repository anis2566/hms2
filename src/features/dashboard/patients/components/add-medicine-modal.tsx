"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useAddMedicine } from "@/hooks/use-medicine";
import { MedicalRecordMedicineSchema, MedicalRecordMedicineSchemaType } from "@/features/dashboard/patients/schemas";
import { MEDICINE_DOSAGE, MEDICINE_FREQUENCY, MEDICINE_INSTRUCTION } from "@/constant";
import { useGetMedicinesForSelect } from "@/features/dashboard/patients/api/use-get-medicines-for-select";
import { LoadingButton } from "@/components/loading-button";

export const AddMedicineModal = () => {
    const { isOpen, form: medicineForm, onClose } = useAddMedicine();

    const { data: medicines, isLoading: isLoadingMedicines } = useGetMedicinesForSelect();

    const form = useForm<MedicalRecordMedicineSchemaType>({
        resolver: zodResolver(MedicalRecordMedicineSchema),
        defaultValues: {
            instruction: undefined,
            frequency: undefined,
            quantity: 0,
            dosageQuantity: 0,
            dosage: undefined,
            medicineId: "",
            medicinePrice: 0,
            medicineName: "",
        },
    });

    const handleDosageChange = (dosage: string) => {
        const dosageArray = form.getValues("dosage") || [];
        const isChecked = dosageArray.includes(dosage);
        if (isChecked) {
            form.setValue("dosage", dosageArray.filter((d) => d !== dosage));
        } else {
            const formatedDosage = dosage.split(" ")[1].charAt(1)
            form.setValue("dosage", [...dosageArray, formatedDosage]);
        }
    };

    const onSubmit = (data: MedicalRecordMedicineSchemaType) => {
        medicineForm?.setValue("medicines", [...medicineForm.getValues("medicines"), data]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Medicine</DialogTitle>
                    <DialogDescription>Add a medicine to the patient's medical record</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="medicineId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medicine</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            const medicine = medicines?.medicines.find((medicine) => medicine.id === value);
                                            form.setValue("medicinePrice", medicine?.price || 0);
                                            form.setValue("medicineName", medicine?.name || "");
                                            field.onChange(value);
                                        }}
                                        defaultValue={field.value}
                                        disabled={isLoadingMedicines}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a medicine" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {medicines?.medicines.map((medicine) => (
                                                <SelectItem key={medicine.id} value={medicine.id}>
                                                    {medicine.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="instruction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instruction</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an instruction" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(MEDICINE_INSTRUCTION).map((instruction) => (
                                                <SelectItem key={instruction} value={instruction}>
                                                    {instruction}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frequency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a frequency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(MEDICINE_FREQUENCY).map((frequency) => (
                                                <SelectItem key={frequency} value={frequency}>
                                                    {frequency}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dosageQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dosage Quantity</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dosage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dosage</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-4">
                                            {
                                                Object.values(MEDICINE_DOSAGE).map((dosage) => (
                                                    <div key={dosage} className="flex items-center gap-x-1">
                                                        <Checkbox id={dosage} onCheckedChange={() => handleDosageChange(dosage)} />
                                                        <Label htmlFor={dosage}>{dosage}</Label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <h1 className="text-lg font-medium">Summary</h1>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Medicine</p>
                                <p className="text-sm text-muted-foreground">
                                    {form.getValues("medicineName")}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="text-sm text-muted-foreground">
                                    {form.getValues("medicinePrice") ? `$${form.getValues("medicinePrice")}` : "N/A"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Quantity</p>
                                <p className="text-sm text-muted-foreground">
                                    {form.getValues("quantity")}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Total Price</p>
                                <p className="text-sm text-muted-foreground">
                                    {form.getValues("medicinePrice") ? `$${form.getValues("medicinePrice") * form.getValues("quantity")}` : "N/A"}
                                </p>
                            </div>
                        </div>

                        <LoadingButton
                            type="submit"
                            title="Add Medicine"
                            loadingTitle="Adding Medicine..."
                            onClick={form.handleSubmit(onSubmit)}
                            isLoading={false}
                            className="w-full"
                            icon={Send}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
