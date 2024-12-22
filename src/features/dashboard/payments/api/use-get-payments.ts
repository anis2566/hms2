import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.payments.$get>;

export const useGetPayments = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("query") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["payments", page, limit, sort, status, q],
    queryFn: async () => {
      const res = await client.api.payments.$get({
        query: { page, limit, sort, status, query: q },
      });
      const parseData = await res.json();
      return { payments: parseData.payments, totalCount: parseData.totalCount };
    },
  });

  return query;
};
