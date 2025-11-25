"use client";
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server";
import page from "./(auth)/signup/page";
import { LogoutButton } from "./login-button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const trpc=useTRPC();
  const queryClient=useQueryClient();
  const {data}= useQuery(trpc.getWorkflows.queryOptions());

  const testAi=useMutation(trpc.testAI.mutationOptions({
    onSuccess:(data)=>{
      toast.success("AI Job Queued");
    }
  }));

  const create=useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess:()=>{
      toast.success("Workflow Created");
    }
}));
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6 p-4">
      protected page
      <div>
        {JSON.stringify(data)}
        </div>
        <Button disabled={testAi.isPending} onClick={() => testAi.mutate()} >Test AI</Button>
        <Button disabled={create.isPending} onClick={() => create.mutate()} >Create Workflow</Button>
      <LogoutButton />
    </div>
    

  );
};
export default Page;