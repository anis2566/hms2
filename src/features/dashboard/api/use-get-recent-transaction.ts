import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.dashboard.recentTransactions)["$get"]
>;

export const useGetRecentTransactions = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["recent-transactions"],
        queryFn: async () => {
            const res = await client.api.dashboard.recentTransactions["$get"]();
            const parseData = await res.json();
            return parseData;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    return query;
};
