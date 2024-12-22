import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.medicines.manufacturers.edit)[":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.medicines.manufacturers.edit)[":id"]["$put"]
>;

interface UseUpdateManufacturerProps {
  onClose: () => void;
}

export const useUpdateManufacturer = ({
  onClose,
}: UseUpdateManufacturerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      console.log(json);
      const res = await client.api.medicines.manufacturers.edit[":id"]["$put"]({
        json,
        param: { id: param.id },
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if ("success" in data) {
        toast.success(data.success, {
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
        onClose();
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
