"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { LoadingButton } from "@/components/loading-button";
import { useDeleteMedicalRecord as useDeleteMedicalRecordApi } from "../api/use-delete-medical-record";
import { useDeleteMedicalRecord } from "@/hooks/use-medical-record";

export const DeleteMedicalRecordModla = () => {
    const { isOpen, id, onClose } = useDeleteMedicalRecord();

    const { mutate, isPending } = useDeleteMedicalRecordApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id } });
    }

    return (
        <AlertDialog open={isOpen && !!id} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your medical record
                        and remove your data from servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <LoadingButton
                        isLoading={isPending}
                        title="Delete"
                        loadingTitle="Deleting..."
                        onClick={handleDelete}
                        variant="destructive"
                        type="button"
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}