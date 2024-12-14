import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  typeof client.api.medicines.manufacturers.create.withImage.$post
>["form"];
type ResponseType = InferResponseType<
  typeof client.api.medicines.manufacturers.create.withImage.$post
>;

interface UseCreateManufacturerProps {
  onClose: () => void;
}

export const useCreateManufacturerWithImage = ({
  onClose,
}: UseCreateManufacturerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const res =
        await client.api.medicines.manufacturers.create.withImage.$post({
          form: {
            name: form.name,
            description: form.description,
            imageUrl: form.imageUrl,
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
        queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
        onClose();
      }
    },
  });

  return mutation;
};
