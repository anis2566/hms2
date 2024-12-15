import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.patients.edit.withImage)[":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.patients.edit.withImage)[":id"]["$put"]
>;

export const useUpdatePatientWithImage = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const res = await client.api.patients.edit.withImage[":id"]["$put"]({
        param: { id: param.id },
        form: {
          ...form,
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
        router.refresh();
      }
    },
  });

  return mutation;
};
