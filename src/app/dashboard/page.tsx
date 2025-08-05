"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth/signin");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Welcome to Aether Dashboard</h1>
                <p className="mb-2">You are signed in as:</p>
                <div className="p-4 bg-muted rounded-md mb-4">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>ID:</strong> {user?.id}</p>
                </div>
                <p className="mb-4 text-muted-foreground">
                    Aether is an AI chatbot that can handle different types of content including markdown, tables, diagrams, code generation, images, and more.
                </p>
                <Button onClick={handleSignOut} className="w-full">
                    Sign Out
                </Button>
            </div>
        </div>
    );
}