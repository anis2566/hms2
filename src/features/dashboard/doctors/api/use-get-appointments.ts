import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.doctors.appointments)[":id"]["$get"]
>;

export const useGetAppointments = (doctorId: string | undefined) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["doctors-appointments", page, limit, sort, q],
        queryFn: async () => {
            if (!doctorId) {
                throw new Error("Patient ID is required");
            }
            const res = await client.api.doctors.appointments[":id"]["$get"]({
                param: { id: doctorId },
                query: { page, limit, sort, query: q },
            });
            const parseData = await res.json();
            return { appointments: parseData.appointments, totalCount: parseData.totalCount };
        },
    });

    return query;
};
