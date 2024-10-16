"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu as MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar: React.FC = () => {
  const navItems = [
    { name: "Dashboard", path: "./" },
    { name: "Focus", path: "./focus" },
    { name: "Events", path: "./todo" },
    { name: "Analysis", path: "./analysis" },
    { name: "Rank", path: "./rank" },
  ];

  const [open, setOpen] = useState(false);

  // Button
  const result = [];

  for (const item of navItems) {
    result.push(
      <Button asChild key={item.name} variant={"link"}>
        <Link onClick={() => setOpen(false)} href={item.path}>
          {item.name}
        </Link>
      </Button>,
    );
  }

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      console.log("setting to dark...");
    } else {
      setTheme("light");
      console.log("setting to light...");
    }
  };

  return (
    <header className="sticky top-0 w-full border-b backdrop-blur-sm">
      <div className="mr-4 hidden gap-2 md:flex items-center justify-center ">
        {result}
        <Button key="theme-switcher" variant={"ghost"} onClick={handleTheme}>
          {theme === "dark" && <SunIcon size={18} />}
          {theme === "light" && <MoonIcon size={18} />}
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex justify-end md:hidden">
          <Button key="theme-switcher" variant={"ghost"} onClick={handleTheme}>
            {theme === "dark" && <SunIcon size={18} />}
            {theme === "light" && <MoonIcon size={18} />}
          </Button>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon />
            </Button>
          </SheetTrigger>
        </div>

        <SheetContent side="right">
          <div className="flex flex-col items-start">{result}</div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Navbar;
