"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const LogoutButton = () => {
    return (
        <div>
            <Button onClick={() => {authClient.signOut();}}>
                Log out
            </Button>
        </div>
    );
}