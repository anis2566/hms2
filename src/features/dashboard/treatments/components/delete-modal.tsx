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
import { useDeleteTreatment as useDeleteTreatmentApi } from "../api/use-delete-treatment";
import { useDeleteTreatment } from "@/hooks/use-treatment";

export const DeleteTreatmentModal = () => {
    const { isOpen, treatmentId, onClose } = useDeleteTreatment();

    const { mutate, isPending } = useDeleteTreatmentApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id: treatmentId } });
    }

    return (
        <AlertDialog open={isOpen && !!treatmentId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your treatment
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