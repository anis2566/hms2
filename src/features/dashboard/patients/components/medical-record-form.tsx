"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { MedicalRecordSchema, MedicalRecordSchemaType } from "../schemas";
import { Textarea } from "@/components/ui/textarea";

export const MedicalRecordForm = () => {
  const form = useForm<MedicalRecordSchemaType>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      complains: "",
      diagnosis: "",
      vitalSigns: "",
      doctorId: "",
      patientId: "",
      treatments: [],
      medicines: [
        {
          instruction: undefined,
          frequency: undefined,
          quantity: 0,
          medicineId: "",
        },
      ],
    },
  });

  const onSubmit = (data: MedicalRecordSchemaType) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Medical Record</CardTitle>
        <CardDescription>Add a new medical record for a patient</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="complains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complains</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitalSigns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vital Signs</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};
