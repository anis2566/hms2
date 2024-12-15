import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.services.$get>;

export const useGetServices = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;
  const status = searchParams.get("status") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["services", page, limit, sort, q, status],
    queryFn: async () => {
      const res = await client.api.services.$get({
        query: { page, limit, sort, query: q, status },
      });
      const parseData = await res.json();
      return { services: parseData.services, totalCount: parseData.totalCount };
    },
  });

  return query;
};
