import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.appointments.$get>;

export const useGetAppointments = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;
  const status = searchParams.get("status") || undefined;
  const date = searchParams.get("date") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["appointments", page, limit, sort, q, status, date],
    queryFn: async () => {
      const res = await client.api.appointments.$get({
        query: { page, limit, sort, query: q, status, date },
      });
      const parseData = await res.json();
      return {
        appointments: parseData.appointments,
        totalCount: parseData.totalCount,
      };
    },
  });

  return query;
};
