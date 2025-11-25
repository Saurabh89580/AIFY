import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server";
import page from "./(auth)/signup/page";
import { LoginButton } from "./login-button";

const Page = async () => {
  await requireAuth();
  const data=await caller.getUsers();
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6 p-4">
      <div>
        {JSON.stringify(data)}
        </div>
      <LoginButton />
    </div>
  );
};
export default Page;