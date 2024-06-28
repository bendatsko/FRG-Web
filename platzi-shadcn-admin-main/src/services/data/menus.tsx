import {
  InfoCircle,
  Error404,
  ServerOff,
  Home,
  Users,
  WifiOff,
  // Login,
  // UserPlus,
  // Shield,
  Settings2,
  Category2,
  Package, Plus, FileSettings
} from "tabler-icons-react";
import {HiCpuChip, HiMiniCpuChip} from "react-icons/hi2";
import {ListIcon} from "lucide-react";
import {HiChip} from "react-icons/hi";
import {RiSettings3Fill} from "react-icons/ri";
import Administrator from "@/pages/administrator";

interface MenuItem {
  title: string;
  link?: string;
  icon?: JSX.Element;
  children?: MenuItem[];
  isOpen?: boolean; // New property to track open/closed state
}

const menus: MenuItem[] = [
  {
    icon: <Home size={18} strokeWidth={2} />,
    title: "Dashboard",
    link: "/dashboard",
    isOpen: false,
  },
  {
    icon: <Plus size={20} strokeWidth={2} />,
    title: "Create",
    children: [
      {
        title: "LDPC Chip Test",
        link: "/create-ldpc",
        icon: <HiChip size={18}  />,
      },
    ],
    isOpen: false,
  },
  // {
  //   icon: <ListIcon size={18} strokeWidth={2} />,
  //   title: "My Tests",
  //   link: "/products",
  //   isOpen: false,
  // },
  {
    icon: <Settings2 size={18} strokeWidth={2} />,
    title: "Settings",
    link: "/settings",
    isOpen: false,
  },
  {
    icon: <FileSettings size={18} strokeWidth={2} />,
    title: "Administrator",
    link: "/administrator",
    isOpen: false,
  },
];

export default menus;
