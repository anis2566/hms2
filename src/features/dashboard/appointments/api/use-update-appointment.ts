import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.appointments.edit)[":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.appointments.edit)[":id"]["$put"]
>;

interface UpdateAppointmentProps {
  redirectUrl?: string;
}

export const useUpdateAppointment = ({
  redirectUrl,
}: UpdateAppointmentProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.appointments.edit[":id"]["$put"]({
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
          queryKey: ["patient-appointments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["doctors-appointments"],
        });
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/dashboard/appointments");
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
