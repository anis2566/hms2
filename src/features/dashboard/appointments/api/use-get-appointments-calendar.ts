import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.appointments.calendar.$get
>;

export const useGetAppointmentsCalender = () => {
  const searchParams = useSearchParams();
  const month = searchParams.get("month") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["appointments-calendar", month],
    queryFn: async () => {
      const res = await client.api.appointments.calendar.$get({
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
