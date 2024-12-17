import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  typeof client.api.patients.health.$post
>["json"];
type ResponseType = InferResponseType<
  typeof client.api.patients.health.$post
>;

export const useCreateHealth = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.patients.health.$post({ json });
      const data = await res.json();
      return data;
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
