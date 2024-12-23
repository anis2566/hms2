import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    typeof client.api.dashboard.$get
>;

export const useGetDashboardData = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["dashboard-data"],
        queryFn: async () => {
            const res = await client.api.dashboard.$get();
            const parseData = await res.json();
            return parseData;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    return query;
};
