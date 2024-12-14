import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.patients.treatmentsForSelect.$get
>;

export const useGetTreatmentsForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["treatmentsForSelect"],
    queryFn: async () => {
      const res = await client.api.patients.treatmentsForSelect.$get();
      const parseData = await res.json();
      return { treatments: parseData.treatments };
    },
  });

  return query;
};
