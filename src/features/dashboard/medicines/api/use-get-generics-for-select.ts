import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.medicines.generics.forSelect.$get
>;

export const useGetGenericsForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["generics-for-select"],
    queryFn: async () => {
      const res = await client.api.medicines.generics.forSelect.$get();
      const parseData = await res.json();
      return {
        generics: parseData.generics,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  return query;
};
