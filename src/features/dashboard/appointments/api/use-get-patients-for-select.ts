import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.appointments.getPatientsForSelect.$get
>;

export const useGetPatientsForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["patientsForSelect"],
    queryFn: async () => {
      const res = await client.api.appointments.getPatientsForSelect.$get();
      const parseData = await res.json();
      return { patients: parseData.patients };
    },
  });

  return query;
};
