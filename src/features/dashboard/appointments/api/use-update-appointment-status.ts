import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.appointments.status)[":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.appointments.status)[":id"]["$put"]
>;

interface UseUpdateAppointmentStatusProps {
  onClose: () => void;
}

export const useUpdateAppointmentStatus = ({
  onClose,
}: UseUpdateAppointmentStatusProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.appointments.status[":id"]["$put"]({
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
        queryClient.invalidateQueries({
          queryKey: ["appointments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["appointments-calendar"],
        });
        queryClient.invalidateQueries({
          queryKey: ["doctors-patients"],
        });
        queryClient.invalidateQueries({
          queryKey: ["doctors-appointments"],
        });
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
