"use client"

import queryString from "query-string"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, format, getMonth, subMonths } from "date-fns"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { MONTHS } from "@/constant"

export const Header = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const month = searchParams.get("month")

    const currentDate = month ? new Date(month) : new Date();

    const handleNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    const formattedMonth = format(nextMonthDate, "yyyy-MM");

    const url = queryString.stringifyUrl({
        url: "/dashboard/appointments",
        query: { month: formattedMonth },
    }, { skipNull: true, skipEmptyString: true })

    router.push(url)
    };

    const handlePreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
    const formattedMonth = format(previousMonthDate, "yyyy-MM");

    const url = queryString.stringifyUrl({
        url: "/dashboard/appointments",
        query: { month: formattedMonth },
    }, { skipNull: true, skipEmptyString: true })

    router.push(url)
  };


    return (
        <div className="flex justify-center items-center gap-x-4 mb-4">
            <Button size="icon" variant="outline" onClick={handlePreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold">{MONTHS[month ? getMonth(new Date(month)) : new Date().getMonth()]} {month ? format(new Date(month), "yyyy") : format(new Date(), "yyyy")}</h1>
            <Button size="icon" variant="outline" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    )
}