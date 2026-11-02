"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Home,
  Utensils,
  ShoppingBag,
  TrendingUp,
  Package,
  BadgePercent,
  Users,
  Pizza,
} from "lucide-react";
import { IconLayoutSidebar, IconLayoutSidebarRight } from "@tabler/icons-react";
import { motion } from "motion/react";

const MotionSpan = motion.span;

export default function AppSidebar() {
  const links = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Menu",
      href: "/menu",
      icon: (
        <Utensils className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Orders",
      href: "/orders",
      icon: (
        <ShoppingBag className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Sales",
      href: "/sales",
      icon: (
        <TrendingUp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Inventory",
      href: "/inventory",
      icon: (
        <Package className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Promos",
      href: "/promos",
      icon: (
        <BadgePercent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center h-10 w-full rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors cursor-pointer border-0 bg-transparent overflow-hidden"
              title={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span className="h-10 w-10 shrink-0 flex items-center justify-center">
                {open ? (
                  <IconLayoutSidebar className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                ) : (
                  <IconLayoutSidebarRight className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                )}
              </span>
              <MotionSpan
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap overflow-hidden"
              >
                Collapse
              </MotionSpan>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export { AppSidebar };

export const Logo = () => {
  const { open } = useSidebar();
  return (
    <a
      href="#"
      className="relative z-20 flex items-center h-10 w-full rounded-md text-sm font-normal text-black hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors overflow-hidden"
    >
      <span className="h-10 w-10 shrink-0 flex items-center justify-center">
        <Pizza className="h-6 w-6 shrink-0 text-[#F65F42]" />
      </span>
      <MotionSpan
        animate={{
          opacity: open ? 1 : 0,
          width: open ? "auto" : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="font-medium whitespace-nowrap text-black dark:text-white overflow-hidden"
      >
        Slice Theory
      </MotionSpan>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center justify-center w-10 h-10 rounded-md text-sm font-normal text-black hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors"
    >
      <Pizza className="h-6 w-6 shrink-0 text-[#F65F42]" />
    </a>
  );
};
