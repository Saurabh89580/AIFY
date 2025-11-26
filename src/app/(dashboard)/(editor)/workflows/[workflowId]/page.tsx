import { requireAuth } from "@/lib/auth-utils";

interface CredentialsPageProps {
    params: Promise<{
        workflowId: string;
    }>;
}
//http://localhost:3000/workflows/12345
const Page = async ({ params }: CredentialsPageProps) => {
    await requireAuth();
    const { workflowId } = await params;
    return <div>Workflow Id is {workflowId}</div>;
};

export default Page;