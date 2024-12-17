import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.appointments.$get>;

export const useGetAppointments = () => {
  const searchParams = useSearchParams()
  const month = searchParams.get("month") || undefined

  const query = useQuery<ResponseType>({
    queryKey: ["appointments", month],
    queryFn: async () => {
      const res = await client.api.appointments.$get({
        query: {
          month: month,
        },
      });
      const parseData = await res.json();
      return {
        appointments: parseData.appointments,
      };
    },
  });

  return query;
};
