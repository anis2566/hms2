"use client"

import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useCreateManufacturer } from "@/hooks/use-manufacturer"

export const NewManufacturerButton = () => {
    const { onOpen } = useCreateManufacturer()

    return (
        <Button onClick={onOpen}>
            <PlusIcon className="w-4 h-4" />
            Add Manufacturer
        </Button>
    )
}