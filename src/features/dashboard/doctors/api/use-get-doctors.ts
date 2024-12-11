import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.doctors.$get>;

export const useGetDoctors = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;
  const title = searchParams.get("title") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["doctors", page, limit, sort, q, title],
    queryFn: async () => {
      const res = await client.api.doctors.$get({
        query: { page, limit, sort, query: q, title },
      });
      const parseData = await res.json();
      return { doctors: parseData.doctors, totalCount: parseData.totalCount };
    },
  });

  return query;
};
