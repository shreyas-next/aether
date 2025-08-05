"use client";

import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import UserAccount from "./user-account";
import React from "react";
import { ChevronDownIcon, PanelRightIcon, PenSquareIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils";
import { useSidebar } from "@/hooks";
import Icons from "./global/icons";
import MobileSidebar from "./mobile-sidebar";
import { User } from "@supabase/supabase-js";

interface Props {
    user: User
}

const MobileHeader = ({ user }: Props) => {

    const router = useRouter();

    const { isOpen: isOpenSidebar, setIsOpen: setIsOpenSidebar } = useSidebar();

    const pathname = usePathname();

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full px-4 h-14 block sm:hidden">
            <div className="flex items-center justify-between w-full h-full text-muted-foreground">
                <div className={cn(
                    "flex items-center",
                    pathname === "/i" ? "flex" : "hidden"
                )}>
                    <MobileSidebar />
                </div>

                {user ? (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            className={cn(
                                "gap-x-1 transition transform duration-300",
                                // isOpenSidebar ? "translate-x-44" : "translate-x-0"
                            )}
                        >
                            <span className="text-lg font-medium">
                                luro
                            </span>
                            <ChevronDownIcon className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <Link href="/">
                        <Icons.iconw className="w-7 h-7 hidden dark:block" />
                        <Icons.icon className="w-7 h-7 block dark:hidden" />
                    </Link>
                )}
                <div className="flex items-center">
                    {user ? (
                        <UserAccount user={user} />
                    ) : (
                        <Link href="/signin" className={buttonVariants({ size: "sm" })}>
                            <span className="text-sm font-medium">
                                Sign Up
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default MobileHeader
