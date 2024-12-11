import {
    LayoutGrid,
    LucideIcon,
    List,
    Layers3,
    BookOpen,
    MessageCircleQuestion,
    PlusCircle,
    BookOpenCheck,
    MessageCircleWarning,
    Book,
    CalendarArrowUp,
    GalleryVertical,
    Users,
    Radio,
    UserCheck,
    Ribbon,
    Package,
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
                    label: "category",
                    active: pathname.includes("/dashboard/category"),
                    icon: Layers3,
                    submenus: [
                        {
                            href: "/dashboard/category/new",
                            label: "New",
                            active: pathname === "/dashboard/category/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/category",
                            label: "List",
                            active: pathname === "/dashboard/category" || pathname.split("/").length > 4,
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Product",
                    active: pathname.includes("/dashboard/product"),
                    icon: Package,
                    submenus: [
                        {
                            href: "/dashboard/product/new",
                            label: "New",
                            active: pathname === "/dashboard/product/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/product",
                            label: "List",
                            active: pathname === "/dashboard/product",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Books",
                    active: pathname.includes("/dashboard/books"),
                    icon: Book,
                    submenus: [
                        {
                            href: "/dashboard/books/new",
                            label: "New",
                            active: pathname === "/dashboard/books/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/books",
                            label: "List",
                            active: pathname === "/dashboard/books",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/dashboard/orders",
                    label: "Orders",
                    active: pathname.includes("/dashboard/orders"),
                    icon: CalendarArrowUp,
                    submenus: [],
                },
                {
                    href: "/dashboard/reviews",
                    label: "Reviews",
                    active: pathname.includes("/dashboard/reviews"),
                    icon: MessageCircleWarning,
                    submenus: [],
                },
                {
                    href: "/dashboard/questions",
                    label: "Questions",
                    active: pathname.includes("/dashboard/questions"),
                    icon: MessageCircleQuestion,
                    submenus: [],
                },
                {
                    href: "",
                    label: "Banners",
                    active: pathname.includes("/dashboard/banners"),
                    icon: GalleryVertical,
                    submenus: [
                        {
                            href: "/dashboard/banners/new",
                            label: "New",
                            active: pathname === "/dashboard/banners/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/banners",
                            label: "List",
                            active: pathname === "/dashboard/banners",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Seller",
            menus: [
                {
                    href: "",
                    label: "Seller",
                    active: pathname === "/admin/seller",
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/seller/new",
                            label: "New",
                            active: pathname === "/dashboard/seller/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/seller/request",
                            label: "Request",
                            active: pathname === "/dashboard/seller/request",
                            icon: Radio,
                        },
                        {
                            href: "/dashboard/seller",
                            label: "List",
                            active: pathname === "/dashboard/seller",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Promotion",
            menus: [
                {
                    href: "/dashboard/subscribers",
                    label: "Subscribers",
                    active: pathname.includes("/dashboard/subscribers"),
                    icon: UserCheck,
                    submenus: [],
                },
            ],
        },
    ];
}

export function getSellerMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/seller",
                    label: "Dashboard",
                    active: pathname === "/seller",
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
                    label: "Books",
                    active: pathname.includes("/seller/books"),
                    icon: BookOpen,
                    submenus: [
                        {
                            href: "/seller/books/new",
                            label: "New",
                            active: pathname === "/seller/books/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/seller/books",
                            label: "List",
                            active: pathname === "/seller/books",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/seller/orders",
                    label: "Orders",
                    active: pathname.includes("/seller/orders"),
                    icon: CalendarArrowUp,
                    submenus: [],
                },
                {
                    href: "/seller/reviews",
                    label: "Reviews",
                    active: pathname.includes("/seller/reviews"),
                    icon: MessageCircleWarning,
                    submenus: [],
                },
                {
                    href: "/seller/questions",
                    label: "Questions",
                    active: pathname.includes("/seller/questions"),
                    icon: MessageCircleQuestion,
                    submenus: [],
                },
            ],
        },
    ];
}