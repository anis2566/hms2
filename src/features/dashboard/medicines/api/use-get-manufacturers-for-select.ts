import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.medicines.manufacturers.forSelect.$get
>;

export const useGetManufacturersForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["manufacturers-for-select"],
    queryFn: async () => {
      const res = await client.api.medicines.manufacturers.forSelect.$get();
      const parseData = await res.json();
      return {
        manufacturers: parseData.manufacturers,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  return query;
};
