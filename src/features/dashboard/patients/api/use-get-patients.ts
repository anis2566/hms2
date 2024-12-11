import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.patients.$get>;

export const useGetPatients = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;
  const gender = searchParams.get("gender") || undefined;
  const date = searchParams.get("date") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["patients", page, limit, sort, q, gender, date],
    queryFn: async () => {
      const res = await client.api.patients.$get({
        query: { page, limit, sort, query: q, gender, date },
      });
      const parseData = await res.json();
      return { patients: parseData.patients, totalCount: parseData.totalCount };
    },
  });

  return query;
};
