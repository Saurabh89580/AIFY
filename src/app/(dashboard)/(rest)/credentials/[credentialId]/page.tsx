import { requireAuth } from "@/lib/auth-utils";

interface CredentialsPageProps {
    params: Promise<{
        credentialId: string;
    }>;
}
//http://localhost:3000/credentials/12345
const Page = async ({ params }: CredentialsPageProps) => {
    await requireAuth();
    const { credentialId } = await params;
    return <div>Credential Id is {credentialId}</div>;
};

export default Page;