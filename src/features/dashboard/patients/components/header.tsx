"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { SearchIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useDebounce } from "@/hooks/use-debounce"
import { GENDER } from "@/constant";
import { cn } from "@/lib/utils"

export const Header = () => {
    const [limit, setLimit] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [date, setDate] = useState<Date>()

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    query: debouncedQuery,
                },
            },
            { skipEmptyString: true, skipNull: true },
        );

        router.push(url);
    }, [debouncedQuery, router, pathname]);

    const handleDateChange = (value: Date) => {
        setDate(value);

        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    date: new Date(
                        new Date(value).setDate(new Date(value).getDate() + 1)
                    ).toISOString(),
                },
            },
            { skipNull: true, skipEmptyString: true },
        );

        router.push(url);
    }

    const handleGenderChange = (value: string) => {
        setGender(value);

        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    ...params,
                    gender: value,
                },
            },
            { skipNull: true, skipEmptyString: true },
        );

        router.push(url);
    };

    const handleSortChange = (value: string) => {
        setSort(value);

        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    ...params,
                    sort: value,
                },
            },
            { skipNull: true, skipEmptyString: true },
        );

        router.push(url);
    };

    const handleLimitChange = (value: string) => {
        setLimit(value);

        const params = Object.fromEntries(searchParams.entries());
        const { ...filteredParams } = params;
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    ...filteredParams,
                    limit: value,
                },
            },
            { skipNull: true, skipEmptyString: true },
        );

        router.push(url);
    };

    const handleReset = () => {
        setLimit("5");
        setQuery("");
        setSort("");
        setGender("");
        setDate(undefined);

        router.push(pathname);
    };

    return (
        <div className="flex items-center justify-between">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="block md:hidden">
                        Filter
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4">
                    <DrawerHeader>
                        <DrawerTitle>Filter</DrawerTitle>
                    </DrawerHeader>

                    <div className="space-y-5">
                        <div className="flex items-center justify-end">
                            <DrawerClose asChild>
                                <Button variant="destructive" size="sm">
                                    Close
                                </Button>
                            </DrawerClose>
                        </div>
                        <div className="relative w-full">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full appearance-none bg-background pl-8 shadow-none"
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <Select
                                    value={gender}
                                    onValueChange={(value) => handleGenderChange(value)}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            Object.values(GENDER).map((gender) => (
                                                <SelectItem value={gender} key={gender}>
                                                    {gender}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[150px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(value) => {
                                                if (value) {
                                                    handleDateChange(value);
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Select
                                    value={sort}
                                    onValueChange={(value) => handleSortChange(value)}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Newest</SelectItem>
                                        <SelectItem value="asc">Oldest</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={limit || ""}
                                    onValueChange={(value) => handleLimitChange(value)}
                                >
                                    <SelectTrigger className="w-[90px]">
                                        <SelectValue placeholder="Limit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["5", "10", "20", "50", "100", "200"].map((v, i) => (
                                            <SelectItem value={v} key={i}>
                                                {v}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={handleReset} size="sm" className="text-red-500 ml-auto flex">
                                Clear Filter
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerContent>
            </Drawer>

            <div className="hidden md:flex items-center gap-x-2">
                <div className="relative w-full max-w-[300px]">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                </div>

                <Select
                    value={gender}
                    onValueChange={(value) => handleGenderChange(value)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            Object.values(GENDER).map((gender) => (
                                <SelectItem value={gender} key={gender}>
                                    {gender}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[150px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(value) => {
                                if (value) {
                                    handleDateChange(value);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Select
                    value={sort}
                    onValueChange={(value) => handleSortChange(value)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest</SelectItem>
                        <SelectItem value="asc">Oldest</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="destructive" onClick={handleReset} size="sm">
                    Clear Filter
                </Button>
            </div>

            <Select
                value={limit || ""}
                onValueChange={(value) => handleLimitChange(value)}
            >
                <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                    {["5", "10", "20", "50", "100", "200"].map((v, i) => (
                        <SelectItem value={v} key={i}>
                            {v}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
};