import { useTRPC } from "@/trpc/client";
import { Client } from "@/app/client";  
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import { getQuarter } from "date-fns";
import { tr } from "date-fns/locale";
import { Suspense } from "react";
import { Fallback } from "@radix-ui/react-avatar";

 

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client/>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
export default Page;