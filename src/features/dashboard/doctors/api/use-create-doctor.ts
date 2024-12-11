import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.doctors.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.doctors.$post>;

export const useCreateDoctor = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.doctors.$post({ json });
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
        router.push("/dashboard/doctors");
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
      }
    },
  });

  return mutation;
};
