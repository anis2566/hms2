import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.dashboard.recentPatients)["$get"]
>;

export const useGetRecentPatients = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["recent-patients"],
        queryFn: async () => {
            const res = await client.api.dashboard.recentPatients["$get"]();
            const parseData = await res.json();
            return parseData;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    return query;
};
