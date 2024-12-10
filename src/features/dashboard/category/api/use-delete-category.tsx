import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { DELETE_CATEGORY_ACTION } from "../server/action";

interface UseDeleteCategoryProps {
    onClose: () => void;
}

export const useDeleteCategory = ({ onClose }: UseDeleteCategoryProps) => {
    return useMutation({
        mutationFn: DELETE_CATEGORY_ACTION,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.success, { duration: 5000 });
                onClose();
            }

            if (data.error) {
                toast.error(data.error, { duration: 5000 });
            }
        },
        onError: (error) => {
            toast.error(error.message, { duration: 5000 });
        },
    });
};