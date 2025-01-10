import { LucideIcon } from "lucide-react";

export interface MenuItem {
  path: string;
  label: string;
  icon?: LucideIcon;
  show: boolean;
}