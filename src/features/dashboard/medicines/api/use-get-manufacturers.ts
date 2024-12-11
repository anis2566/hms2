import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.medicines.manufacturers.$get
>;

export const useGetManufacturers = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["manufacturers", page, limit, sort, q],
    queryFn: async () => {
      const res = await client.api.medicines.manufacturers.$get({
        query: { page, limit, sort, query: q },
      });
      const parseData = await res.json();
      return {
        manufacturers: parseData.manufacturers,
        totalCount: parseData.totalCount,
      };
    },
  });

  return query;
};
