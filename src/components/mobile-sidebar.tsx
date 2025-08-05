"use client";

import { cn } from "@/utils";
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks";
import Icons from "./global/icons";

const MobileSidebar = () => {

    const pathname = usePathname();

    const { isOpen, setIsOpen } = useSidebar();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="iconlg"
                    variant="ghost"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "transition transform",
                        pathname === "/i" ? "flex" : "hidden"
                    )}
                >
                    <Icons.panel className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" show={false}>
                <SheetClose asChild>
                    <Button
                        size="iconlg"
                        variant="ghost"
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "transition transform text-muted-foreground -mt-[5px]",
                            pathname === "/i" ? "flex" : "hidden"
                        )}
                    >
                        <Icons.panel className="w-6 h-6" />
                    </Button>
                </SheetClose>
            </SheetContent>
        </Sheet>

        // <div
        //     data-state={isOpen ? "open" : "closed"}
        //     className={cn(
        //         "peer absolute inset-y-0 z-50 hidden -translate-x-full border- border-border bg-background duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-68"
        //         // "flex-shrink-0 absolute bg-muted h-full overflow-hidden scrollbar-hide z-[100] transition-all duration-300",
        //         // isOpen ? "visible w-64" : "invisible w-0"
        //     )}
        // >
        //     <div className="h-full w-full flex flex-col pt-14">
        //         <div className="flex items-center p-4">
        //             <h4 className="text-sm font-medium capitalize">
        //                 Chat history
        //             </h4>
        //         </div>
        //         <div className="mb-2 px-2">
        //             <Link
        //                 href="/"
        //                 className={cn(
        //                     buttonVariants({ variant: 'outline' }),
        //                     'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10 gap-x-1.5 rounded-lg'
        //                 )}
        //             >
        //                 <PlusIcon className="w-4 h-4" />
        //                 New Chat
        //             </Link>
        //         </div>
        //         <React.Suspense
        //             fallback={
        //                 <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
        //                     {Array.from({ length: 10 }).map((_, i) => (
        //                         <div
        //                             key={i}
        //                             className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
        //                         />
        //                     ))}
        //                 </div>
        //             }
        //         >
        //             <SidebarList />
        //         </React.Suspense>
        //     </div>
        // </div>
    )
};

export default MobileSidebar
