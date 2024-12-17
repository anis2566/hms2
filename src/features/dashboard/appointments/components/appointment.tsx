"use client"

import { Calendar, List } from "lucide-react"
import { useState } from "react"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

import { AppointmentListCalendar } from "./appointment-list-calendar"
import { AppointmentList } from "./appointment-list"

export const AppointmentPage = () => {
    const [view, setView] = useState<string>("list")

    return (
        <div className="space-y-6">
            <ToggleGroup type="single" onValueChange={value => setView(value)} defaultValue="list" className="flex justify-start max-w-fit">
                <ToggleGroupItem value="list" aria-label="list">
                    <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="calendar" aria-label="calendar">
                    <Calendar className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>

            <Collapsible open={view === "list"}>
                <CollapsibleContent>
                    <AppointmentList />
                </CollapsibleContent>
            </Collapsible>

            <Collapsible open={view === "calendar"}>
                <CollapsibleContent>
                    <AppointmentListCalendar />
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}