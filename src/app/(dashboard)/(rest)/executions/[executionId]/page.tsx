import { requireAuth } from "@/lib/auth-utils";

interface CredentialsPageProps {
    params: Promise<{
        executionId: string;
    }>;
}
//http://localhost:3000/credentials/12345
const Page = async ({ params }: CredentialsPageProps) => {
    await requireAuth();
    const { executionId } = await params;
    return <div>Execution Id is {executionId}</div>;
};

export default Page;