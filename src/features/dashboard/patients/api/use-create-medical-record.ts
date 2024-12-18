import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  typeof client.api.patients.medicalRecord.$post
>["form"];
type ResponseType = InferResponseType<
  typeof client.api.patients.medicalRecord.$post
>;

export const useCreateMedicalRecord = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const res = await client.api.patients.medicalRecord.$post({
        form: {
          ...form,
        },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) {
        toast.error(data.error, {
          duration: 5000,
        });
      }

      // if ("success" in data) {
      //   toast.success(data.success, {
      //     duration: 5000,
      //   });
      //   router.push(`/dashboard/patients/${data.id}`);
      //   queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
      // }
    },
  });

  return mutation;
};
