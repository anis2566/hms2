import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { EDIT_CATEGORY_ACTION } from "../server/action";

export const useUpdateCategory = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: EDIT_CATEGORY_ACTION,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success, {
          duration: 5000,
        });
        router.push("/dashboard/category");
      }

      if (data.error) {
        toast.error(data.error, {
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
      });
    },
  });
};
