import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.patients.medicalRecords)[":patientId"]["$get"]
>;

export const useGetMedicalRecords = (patientId: string | undefined) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["medicalRecords", patientId, page],
    queryFn: async () => {
      if (!patientId) {
        throw new Error("Patient ID is required to fetch medical records");
      }

      const res = await client.api.patients.medicalRecords[":patientId"][
        "$get"
      ]({
        param: { patientId },
        query: { page },
      });
      const parseData = await res.json();
      return {
        medicalRecords: parseData.medicalRecords,
        totalCount: parseData.totalCount,
      };
    },
    enabled: !!patientId,
  });

  return query;
};
