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
import { useDeleteManufacturer as useDeleteManufacturerApi } from "../api/use-delete-manufacturer";
import { useDeleteManufacturer } from "@/hooks/use-manufacturer";

export const DeleteManufacturerModal = () => {
    const { isOpen, id, onClose } = useDeleteManufacturer();

    const { mutate, isPending } = useDeleteManufacturerApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id } });
    }

    return (
        <AlertDialog open={isOpen && !!id} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your manufacturer
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