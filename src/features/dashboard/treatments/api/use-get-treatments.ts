import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.treatments.$get>;

export const useGetTreatments = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["treatments", page, limit, sort, q],
    queryFn: async () => {
      const res = await client.api.treatments.$get({
        query: { page, limit, sort, query: q },
      });
      const parseData = await res.json();
      return {
        treatments: parseData.treatments,
        totalCount: parseData.totalCount,
      };
    },
  });

  return query;
};
