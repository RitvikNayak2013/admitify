"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Home,
  LibraryBig,
  Menu,
  Settings,
  Sparkles,
  Target,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/lib/storage";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/universities", label: "Dream Schools", icon: GraduationCap },
  { href: "/roadmap", label: "Roadmap", icon: ClipboardList },
  { href: "/activities", label: "Activities", icon: BriefcaseBusiness },
  { href: "/vault", label: "Proof Vault", icon: LibraryBig },
  { href: "/counselor", label: "Coach", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white/88 shadow-sm backdrop-blur-xl">
      <div className="flex h-20 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-teal-200 shadow-sm">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold">Admitify</p>
          <p className="text-xs text-muted-foreground">AI portfolio OS</p>
        </div>
      </div>
      <nav className="scrollbar-soft flex-1 space-y-1 overflow-y-auto p-3 pt-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-teal-50 hover:text-foreground",
                active && "bg-slate-950 text-white shadow-sm hover:bg-slate-950 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg border bg-slate-950 p-3 text-white">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-200" />
            Ethical readiness only
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Build real work. Keep proof. Stay honest.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useProfile();
  const pathname = usePathname();

  return (
    <div className="app-noise min-h-screen overflow-x-hidden bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar />
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation overlay" className="absolute inset-0 bg-slate-950/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b bg-white/82 px-4 py-3 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-normal md:text-xl">{title}</h1>
                <Badge variant="outline" className="hidden md:inline-flex">
                  {profile.intendedMajor || "Profile"}
                </Badge>
              </div>
              {subtitle ? <p className="hidden max-w-2xl text-sm text-muted-foreground md:block">{subtitle}</p> : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard?tour=1" className="hidden md:block">
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4" />
                Tour
              </Button>
            </Link>
            <Link href="/counselor" className="hidden sm:block">
              <Button variant="secondary" size="sm">
                <BrainCircuit className="h-4 w-4" />
                Ask AI
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                <CalendarCheck className="h-4 w-4" />
                Update profile
              </Button>
            </Link>
          </div>
        </header>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 md:px-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
