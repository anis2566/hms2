import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.appointments.delete)[":id"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.appointments.delete)[":id"]["$delete"]
>;

interface Props {
  onClose: () => void;
}

export const useDeleteAppointment = ({ onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.appointments.delete[":id"]["$delete"]({
        param: { id: param.id },
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if ("success" in data) {
        toast.success(data.success, { duration: 5000 });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments-calendar"] });
        queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
        onClose();
      }

      if ("error" in data) {
        toast.error(data.error, { duration: 5000 });
      }
    },
    onError: (error) => {
      toast.error(error.message, { duration: 5000 });
    },
  });

  return mutation;
};
