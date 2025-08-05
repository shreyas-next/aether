"use client";

import React from "react"
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

interface Props {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
    return (
        <>
            <Toaster
                richColors
                position="top-center"
            />
            {children}
        </>
    );
};

export default Providers
