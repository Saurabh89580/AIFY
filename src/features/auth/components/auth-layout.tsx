import Link from "next/link";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-muted flex items-center flex-col justify-center min-h-svh gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 self-center font-medium">
            <Image src="/logos/logo.svg" alt="GitHub logo" width={30} height={30} />AIFY
            </Link>
            {children}
            </div>
        </div>
    );
}
export default AuthLayout;