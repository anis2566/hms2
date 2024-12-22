import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.patients.payments)[":patientId"]["$get"]
>;

export const useGetPayments = (patientId: string | undefined) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const status = searchParams.get("status") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["patient-payments", patientId, page, limit, sort, status],
    queryFn: async () => {
      if (!patientId) {
        throw new Error("Patient ID is required to fetch medical records");
      }

      const res = await client.api.patients.payments[":patientId"]["$get"]({
        param: { patientId },
        query: { page, limit, sort, status },
      });
      const parseData = await res.json();
      return {
        payments: parseData.payments,
        totalCount: parseData.totalCount,
      };
    },
    enabled: !!patientId,
  });

  return query;
};
