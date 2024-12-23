import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.doctors.patients)[":id"]["$get"]
>;

export const useGetPatients = (doctorId: string | undefined) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const q = searchParams.get("query") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["doctors-patients", page, limit, sort, q],
    queryFn: async () => {
      if (!doctorId) {
        throw new Error("Patient ID is required to fetch medical records");
      }
      const res = await client.api.doctors.patients[":id"]["$get"]({
        param: { id: doctorId },
        query: { page, limit, sort, query: q },
      });
      const parseData = await res.json();
      return { patients: parseData.patients, totalCount: parseData.totalCount };
    },
  });

  return query;
};
