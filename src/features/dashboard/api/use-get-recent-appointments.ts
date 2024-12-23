import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.dashboard.recentAppointments)["$get"]
>;

export const useGetRecentAppointments = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["recent-appointments"],
        queryFn: async () => {
            const res = await client.api.dashboard.recentAppointments["$get"]();
            const parseData = await res.json();
            return parseData;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    return query;
};
