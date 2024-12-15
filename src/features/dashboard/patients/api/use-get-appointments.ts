import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.patients.appointments)[":patientId"]["$get"]
>;

export const useGetAppointments = (patientId: string | undefined) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["patient-appointments", patientId, page, limit, sort],
    queryFn: async () => {
      if (!patientId) {
        throw new Error("Patient ID is required to fetch medical records");
      }

      const res = await client.api.patients.appointments[":patientId"]["$get"]({
        param: { patientId },
        query: { page, limit, sort },
      });
      const parseData = await res.json();
      return {
        appointments: parseData.appointments,
        totalCount: parseData.totalCount,
      };
    },
    enabled: !!patientId,
  });

  return query;
};
