import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.patients.doctorsForSelect.$get
>;

export const useGetDoctorsForSelect = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["doctorsForSelect"],
    queryFn: async () => {
      const res = await client.api.patients.doctorsForSelect.$get();
      const parseData = await res.json();
      return { doctors: parseData.doctors };
    },
  });

  return query;
};
