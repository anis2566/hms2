"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Patient, PatientHealth } from "@prisma/client"
import { Send } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { PatientHealthSchema, PatientHealthSchemaType } from "@/features/dashboard/patients/schemas"
import { BLOOD_GROUP } from "@/constant"
import { LoadingButton } from "@/components/loading-button"
import { useCreateHealth } from "../api/use-create-health"

interface HealthWithPatient extends Patient {
    health: PatientHealth
}

interface Props {
    patient: HealthWithPatient
}

export const HealthForm = ({ patient }: Props) => {
    const { mutate: createHealth, isPending } = useCreateHealth()

    const form = useForm<PatientHealthSchemaType>({
        resolver: zodResolver(PatientHealthSchema),
        defaultValues: {
            patientId: patient.id,
            bloodGroup: patient.health?.bloodGroup as BLOOD_GROUP,
            height: patient.health?.height || 0,
            weight: patient.health?.weight || 0,
            allergies: patient.health?.allergies || "",
            habits: patient.health?.habits || "",
            medicalHistory: patient.health?.medicalHistory || "",
        },
    })

    const onSubmit = (data: PatientHealthSchemaType) => {
        createHealth(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Health</CardTitle>
                <CardDescription>
                    Update patient health information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value as BLOOD_GROUP)}
                                value={field.value}
                                defaultValue={field.value}
                                disabled={isPending}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a blood group" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(BLOOD_GROUP).map((bloodGroup) => (
                                        <SelectItem key={bloodGroup} value={bloodGroup}>
                                            {bloodGroup}
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
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} placeholder="5.5 fit" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} placeholder="60 kg" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="beans, nuts, etc." disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="habits"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Habits</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="smoking, drinking, etc." disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                        
                <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Medical History</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="diabetes, hypertension, etc." disabled={isPending} />
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
    )
}