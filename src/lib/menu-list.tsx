import {
    LayoutGrid,
    LucideIcon,
    List,
    PlusCircle,
    Users,
    UsersRound,
    Shovel,
    Pill,
    SquareStack,
    Ambulance,
    Calendar,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getAdminMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    active: pathname === "/dashboard",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Main",
            menus: [
                {
                    href: "",
                    label: "Patients",
                    active: pathname.includes("/dashboard/patients"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/patients/new",
                            label: "New",
                            active: pathname === "/dashboard/patients/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/patients",
                            label: "List",
                            active: pathname === "/dashboard/patients" || pathname.split("/").length > 4,
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Doctors",
                    active: pathname.includes("/dashboard/doctors"),
                    icon: UsersRound,
                    submenus: [
                        {
                            href: "/dashboard/doctors/new",
                            label: "New",
                            active: pathname === "/dashboard/doctors/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/doctors",
                            label: "List",
                            active: pathname === "/dashboard/doctors" || pathname.split("/").length > 4,
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Treatments",
                    active: pathname.includes("/dashboard/treatments"),
                    icon: Shovel,
                    submenus: [
                        {
                            href: "/dashboard/treatments/new",
                            label: "New",
                            active: pathname === "/dashboard/treatments/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/treatments",
                            label: "List",
                            active: pathname === "/dashboard/treatments",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Medicines",
                    active: pathname.includes("/dashboard/medicines"),
                    icon: Pill,
                    submenus: [
                        {
                            href: "/dashboard/medicines/new",
                            label: "New",
                            active: pathname === "/dashboard/medicines/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/medicines",
                            label: "List",
                            active: pathname === "/dashboard/medicines",
                            icon: List,
                        },
                        {
                            href: "/dashboard/medicines/generics",
                            label: "Generics",
                            active: pathname === "/dashboard/medicines/generics",
                            icon: SquareStack,
                        },
                        {
                            href: "/dashboard/medicines/manufacturers",
                            label: "Manufacturers",
                            active: pathname === "/dashboard/medicines/manufacturers",
                            icon: Ambulance,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Appointments",
                    active: pathname.includes("/dashboard/appointments"),
                    icon: Calendar,
                    submenus: [
                        {
                            href: "/dashboard/appointments/new",
                            label: "New",
                            active: pathname === "/dashboard/appointments/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/appointments",
                            label: "List",
                            active: pathname === "/dashboard/appointments",
                            icon: List,
                        },
                    ],
                },
            ],
        },
    ];
}
