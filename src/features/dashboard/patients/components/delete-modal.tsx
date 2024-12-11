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
import { useDeletePatient as useDeletePatientApi } from "../api/use-delete-patient";
import { useDeletePatient } from "@/hooks/use-patient";

export const DeletePatientModal = () => {
    const { isOpen, patientId, onClose } = useDeletePatient();

    const { mutate, isPending } = useDeletePatientApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id: patientId } });
    }

    return (
        <AlertDialog open={isOpen && !!patientId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your patient
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