import { ChatsResponse } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useGetChats() {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chats"],
    queryFn: async () =>
      axios
        .get<ChatsResponse>("/api/chats", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        })
        .then((res) => res.data)
        .then((responseData) => {
          responseData.chats.forEach((chat) => {
            queryClient.setQueryData(["chat", chat.id], chat);
          });
          return responseData;
        }),
    //refetchOnMount: false,
  });

  return { query };
}
