import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.medicines.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.medicines.$post>;

export const useCreateMedicine = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.medicines.$post({ json });
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
        queryClient.invalidateQueries({ queryKey: ["medicines"] });
        router.push("/dashboard/medicines");
      }
    },
  });

  return mutation;
};
