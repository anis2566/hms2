import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.patients.medicinesForSelect.$get
>;

export const useGetMedicinesForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["medicinesForSelect"],
    queryFn: async () => {
      const res = await client.api.patients.medicinesForSelect.$get();
      const parseData = await res.json();
      return { medicines: parseData.medicines };
    },
  });

  return query;
};
