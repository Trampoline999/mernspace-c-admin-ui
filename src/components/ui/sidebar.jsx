"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

// Emil Kowalski easing tokens
const EASE_IN_OUT = [0.77, 0, 0.175, 1];
const EASE_DRAWER = [0.32, 0.72, 0, 1];

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  const shouldReduceMotion = useReducedMotion();
  return (
    <>
      <motion.div
        className={cn(
          "h-full py-4 px-2.5 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-x-hidden border-r border-neutral-200 dark:border-neutral-800 relative z-20",
          className
        )}
        animate={{
          width: open ? "240px" : "60px",
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: EASE_IN_OUT,
        }}
        {...props}>
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  const shouldReduceMotion = useReducedMotion();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}>
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ transform: "translateX(-100%)", opacity: 0 }}
              animate={{ transform: "translateX(0%)", opacity: 1 }}
              exit={{ transform: "translateX(-100%)", opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: EASE_DRAWER,
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}>
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}>
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  const shouldReduceMotion = useReducedMotion();
  const labelContent = React.isValidElement(link.label)
    ? link.label.props.children
    : link.label;

  return (
    <NavLink
      to={link.href}
      className={({ isActive }) =>
        cn(
          "flex items-center h-10 w-full rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-[background-color,transform] duration-150 active:scale-[0.98] group/sidebar cursor-pointer overflow-hidden",
          isActive && "bg-neutral-200/80 dark:bg-neutral-700/80 font-medium",
          className
        )
      }
      title={typeof labelContent === "string" ? labelContent : undefined}
      {...props}>
      <span className="h-10 w-10 shrink-0 flex items-center justify-center">
        {link.icon}
      </span>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: EASE_IN_OUT,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-nowrap overflow-hidden inline-block !p-0 !m-0">
        {labelContent}
      </motion.span>
    </NavLink>
  );
};
