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
import { useDeleteDoctor as useDeleteDoctorApi } from "../api/use-delete-doctor";
import { useDeleteDoctor } from "@/hooks/use-doctor";

export const DeleteDoctorModal = () => {
    const { isOpen, doctorId, onClose } = useDeleteDoctor();

    const { mutate, isPending } = useDeleteDoctorApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id: doctorId } });
    }

    return (
        <AlertDialog open={isOpen && !!doctorId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your doctor
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