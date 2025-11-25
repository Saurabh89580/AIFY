"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const LoginButton = () => {
    return (
        <div>
            <Button onClick={() => {authClient.signOut();}}>
                Login out
            </Button>
        </div>
    );
}