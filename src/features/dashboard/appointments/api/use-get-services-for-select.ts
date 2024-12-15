import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.appointments.getServicesForSelect.$get
>;

export const useGetServicesForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["servicesForSelect"],
    queryFn: async () => {
      const res = await client.api.appointments.getServicesForSelect.$get();
      const parseData = await res.json();
      return { services: parseData.services };
    },
  });

  return query;
};
