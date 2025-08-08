"use client";

import { useSidebar } from "@/hooks";
import { cn } from "@/utils";

interface Props {

    children: React.ReactNode;
}

const MainWrapper = ({ children }: Props) => {

    const { isOpen: isOpenSidebar } = useSidebar();

    return (
        <div
            className={cn(
                "w-full h-dvh mx-auto transition-all duration-300 ease-in-out",
                isOpenSidebar ? "lg:ml-68" : "lg:ml-0"
            )}
        >
            {children}
        </div>
    );
};

export default MainWrapper;
