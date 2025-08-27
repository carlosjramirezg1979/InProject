'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User } from "lucide-react";

const navItems = [
    {
        href: "/dashboard/settings/profile",
        label: "Perfil",
        icon: User,
    },
    // Add more settings pages here in the future
];

export function SettingsNav() {
    const pathname = usePathname();

    return (
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-transparent hover:underline",
                        "justify-start"
                    )}
                    >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
