import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@/lib/rpc";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../components/password-form";

type RequestType = InferRequestType<
    typeof client.api.doctors.changePassword[":id"]["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.doctors.changePassword)[":id"]["$put"]
>;

interface Props {
    form: UseFormReturn<z.infer<typeof formSchema>>
}

export const useUpdatePassword = ({ form }: Props) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const res = await client.api.doctors.changePassword[":id"]["$put"]({
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
                form.reset();
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
