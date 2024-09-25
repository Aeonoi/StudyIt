"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu as MenuIcon } from "lucide-react";

function Navbar(): JSX.Element {
  const navItems = [
    { name: "Dashboard", path: "./" },
    { name: "Focus", path: "./focus" },
    { name: "To-Do", path: "./todo" },
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

  return (
    <header className="sticky top-0 w-full border-b backdrop-blur-sm">
      <div className="mr-4 hidden gap-2 md:flex items-center justify-center ">
        {result}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <div className="flex flex-col items-start">{result}</div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default Navbar;
