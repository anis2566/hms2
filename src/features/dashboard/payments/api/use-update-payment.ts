import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.payments.edit)[":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.payments.edit)[":id"]["$put"]
>;

interface Props {
  redirectUrl?: string;
}

export const useUpdatePayment = ({ redirectUrl }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.payments.edit[":id"]["$put"]({
        param: { id: param.id },
        json,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if ("success" in data) {
        toast.success(data.success, {
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/dashboard/payments");
        }
      }

      if ("error" in data) {
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

  return mutation;
};
