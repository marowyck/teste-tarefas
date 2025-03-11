"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { LogoutButton } from "@/LogoutBtn";
import { useUserStore } from "@/app/stores/useUserStore";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function UserProfile() {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();

  const [checked, setChecked] = useState(false);

  const handleDarkModeClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!checked) {
      setTheme("dark");
      setChecked(true);
    } else {
      setTheme("light");
      setChecked(false);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <FaRegUser className="text-[20px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel className="text-lg text-gray-600">
          {user?.email}
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center justify-between mb-2"
            onClick={handleDarkModeClick}
          >
            <Label htmlFor="airplane-mode">Modo Escuro</Label>
            <Switch
              checked={checked}
              onCheckedChange={(checked) => setChecked(checked)}
              id="airplane-mode"
            />
          </DropdownMenuItem>

          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
