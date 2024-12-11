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
import { useDeleteMedicine as useDeleteMedicineApi } from "../api/use-delete-medicine";
import { useDeleteMedicine } from "@/hooks/use-medicine";

export const DeleteMedicineModal = () => {
    const { isOpen, medicineId, onClose } = useDeleteMedicine();

    const { mutate, isPending } = useDeleteMedicineApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id: medicineId } });
    }

    return (
        <AlertDialog open={isOpen && !!medicineId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your medicine
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