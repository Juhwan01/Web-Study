// src/components/layouts/sidebar.tsx
"use client";

import { FC } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  MenuSquare, 
  Table2, 
  Clock 
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();

  const routes = [
    {
      label: "대시보드",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500"
    },
    {
      label: "대기관리",
      icon: Clock,
      href: "/dashboard/queue",
      color: "text-violet-500",
    },
    {
      label: "테이블",
      icon: Table2,
      href: "/dashboard/tables",
      color: "text-pink-700",
    },
    {
      label: "메뉴",
      icon: MenuSquare,
      href: "/dashboard/menu",
      color: "text-orange-700",
    },
    {
      label: "주문",
      icon: Users,
      href: "/dashboard/orders",
      color: "text-emerald-500",
    },
  ];

  return (
    <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900", className)}>
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold text-white">
            Restaurant Manager
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};