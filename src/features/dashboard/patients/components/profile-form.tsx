"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BLOOD_GROUP, GENDER } from "@/constant";
import { format } from "date-fns";
import { CalendarIcon, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { Patient } from "@prisma/client";
import Image from "next/image";

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
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { PatientSchemaType, PatientSchema } from "../schemas";
import { LoadingButton } from "@/components/loading-button";
import ImageUpload from "@/components/ui/image-upload";
import { useUpdatePatient } from "../api/use-update-patient";

interface Props {
    patient: Patient
}

export const ProfileForm = ({ patient }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdiImage, setIsEditImage] = useState<boolean>(true)
    const [date, setDate] = useState<Date | null>(null);

    const { mutate: updatePatient, isPending } = useUpdatePatient({ redirectUrl: undefined });

    const form = useForm<PatientSchemaType>({
        resolver: zodResolver(PatientSchema),
        defaultValues: {
            name: patient.name,
            email: patient.email || "",
            gender: patient.gender as GENDER,
            phone: patient.phone,
            address: patient.address,
            dob: patient.dob.toISOString(),
            emergencyContact: patient.emergencyContact,
            imageUrl: undefined,
            bloodGroup: patient.bloodGroup as BLOOD_GROUP,
        },
    });

    const onSubmit = (values: PatientSchemaType) => {
        updatePatient({
            param: { id: patient.id },
            json: values
        })
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
                <CardDescription>
                    Custome patient profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        {
                                            isEdiImage && patient.imageUrl ? (
                                                <div className="relative">
                                                    <div className="relative aspect-square max-h-[100px]">
                                                        <Image src={patient.imageUrl} alt="Profile" fill className="object-contain rounded-full" />
                                                    </div>
                                                    <Button type="button" variant="destructive" className="absolute right-0 top-0" onClick={() => setIsEditImage(false)}>
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <ImageUpload values={field.value ? [field.value] : []} onUploadComplete={value => field.onChange(value[0])} disabled={false} multiple={true} path="patients" name="Patient" />
                                            )
                                        }
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value as GENDER)}
                                        defaultValue={field.value}
                                        disabled={isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(GENDER).map((gender) => (
                                                <SelectItem key={gender} value={gender}>
                                                    {gender}
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
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isPending}
                                                >
                                                    {field.value ? (
                                                        `${format(field.value, "PPP")}`
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={date || new Date(field.value)}
                                                onSelect={(selectedDate) => {
                                                    setDate(selectedDate!);
                                                    field.onChange(selectedDate?.toDateString());
                                                }}
                                                onDayClick={() => setIsOpen(false)}
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                                defaultMonth={new Date(field.value)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emergencyContact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
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