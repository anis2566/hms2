import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { client } from "@/lib/rpc";
import { formSchema } from "../components/images-form";

type RequestType = InferRequestType<
  (typeof client.api.patients.edit.images)[":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.patients.edit.images)[":id"]["$put"]
>;

interface UseUpdateImages {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const useUpdateImages = ({ form }: UseUpdateImages) => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.patients.edit.images[":id"]["$put"]({
        param: { id: param.id },
        json: {
          ...json,
        },
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if ("error" in data) {
        toast.error(data.error, {
          duration: 5000,
        });
      }

      if ("success" in data) {
        toast.success(data.success, {
          duration: 5000,
        });
        form.reset({
          files: [],
          existingFils: [],
        });
        router.refresh();
      }
    },
  });

  return mutation;
};
