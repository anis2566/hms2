import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.auth.login.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;

interface LoginResponse {
  redirectUrl: string;
}

export const useLogin = ({ redirectUrl }: LoginResponse) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.auth.login.$post({ json });
      return await res.json();
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        toast.error(data.error, {
          duration: 5000,
        });
      }

      if ("success" in data) {
        toast.success(data.success, {
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ["current"] });

        if (redirectUrl) {
          router.push(`/redirect?redirectUrl=${redirectUrl}`);
        } else {
          router.push("/dashboard");
        }
      }
    },
    onSettled: () => {
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong", {
        duration: 5000,
      });
    },
  });

  return mutation;
};
