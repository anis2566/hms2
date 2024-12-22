"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MedicalRecordSchema, MedicalRecordSchemaType } from "../schemas";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useGetDoctorsForSelect } from "../api/use-get-doctors-for-select";
import { useGetTreatmentsForSelect } from "../api/use-get-treatments-for-select";
import { useAddMedicine } from "@/hooks/use-medicine";
import ImageUpload from "@/components/ui/image-upload";
import { LoadingButton } from "@/components/loading-button";
import { useCreateMedicalRecord } from "../api/use-create-medical-record";

interface MedicalRecordFormProps {
  patientId: string;
}

export const MedicalRecordForm = ({ patientId }: MedicalRecordFormProps) => {
  const { onOpen } = useAddMedicine()

  const { data: doctors, isLoading: isLoadingDoctors } = useGetDoctorsForSelect();
  const { data: treatments } = useGetTreatmentsForSelect();

  const { mutate: createMedicalRecord, isPending: isLoadingCreateMedicalRecord } = useCreateMedicalRecord();

  const form = useForm<MedicalRecordSchemaType>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      complains: "",
      diagnosis: "",
      vitalSigns: "",
      doctorId: "",
      patientId: patientId,
      treatments: undefined,
      medicines: undefined,
      attachments: []
    },
  });

  const handleTreatmentsChange = (value: string) => {
    const isExist = form.getValues("treatments")?.includes(value);
    if (isExist) {
      form.setValue("treatments", form.getValues("treatments")?.filter((treatment) => treatment !== value));
    } else {
      form.setValue("treatments", [...form.getValues("treatments") || [], value]);
    }
  };

  const handleRemoveMedicine = (medicineId: string) => {
    form.setValue("medicines", form.getValues("medicines")?.filter((medicine) => medicine.medicineId !== medicineId));
  };

  const onSubmit = (data: MedicalRecordSchemaType) => {
    createMedicalRecord(data);
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
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingDoctors || isLoadingCreateMedicalRecord}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors?.doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
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
              name="complains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complains</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} disabled={isLoadingCreateMedicalRecord} />
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
                    <Textarea className="resize-none" {...field} disabled={isLoadingCreateMedicalRecord} />
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
                    <Textarea className="resize-none" {...field} disabled={isLoadingCreateMedicalRecord} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatments"
              render={() => (
                <FormItem>
                  <FormLabel>Treatments</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      {treatments?.treatments.map((treatment) => (
                        <div key={treatment.id} className="flex items-center gap-x-2">
                          <Checkbox id={treatment.id} onCheckedChange={() => handleTreatmentsChange(treatment.id)} disabled={isLoadingCreateMedicalRecord} />
                          <Label htmlFor={treatment.id}>{treatment.name}</Label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicines"
              render={() => (
                <FormItem>
                  <FormLabel>Medicines</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-accent hover:bg-accent/80">
                            <TableHead>Item</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Instruction</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {
                            form.watch("medicines")?.map((medicine) => (
                              <TableRow key={medicine.medicineId}>
                                <TableCell>{medicine.medicineName}</TableCell>
                                <TableCell>{`$${medicine.medicinePrice}`}</TableCell>
                                <TableCell>{`${medicine.dosageQuantity} - ${medicine.dosage.join("/")}`}</TableCell>
                                <TableCell>{medicine.instruction}</TableCell>
                                <TableCell>{medicine.quantity}</TableCell>
                                <TableCell>{`$${medicine.medicinePrice * medicine.quantity}`}</TableCell>
                                <TableCell>
                                  <Button variant="destructive" size="icon" onClick={() => handleRemoveMedicine(medicine.medicineId)} disabled={isLoadingCreateMedicalRecord}>
                                    <Trash2 />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                      <Button type="button" variant="outline" onClick={() => onOpen(form)} disabled={isLoadingCreateMedicalRecord}>Add Medicine</Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments</FormLabel>
                  <FormControl>
                    <ImageUpload values={field.value || []} onUploadComplete={value => field.onChange(value)} disabled={isLoadingCreateMedicalRecord} multiple={true} path="patients" name={patientId} />
                  </FormControl>
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              title="Submit"
              loadingTitle="Submitting..."
              isLoading={isLoadingCreateMedicalRecord}
              onClick={form.handleSubmit(onSubmit)}
              icon={Send}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};
