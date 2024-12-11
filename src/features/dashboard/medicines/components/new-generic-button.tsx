"use client"

import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useCreateGeneric } from "@/hooks/use-generic"

export const NewGenericButton = () => {
    const { onOpen } = useCreateGeneric()

    return (
        <Button onClick={onOpen}>
            <PlusIcon className="w-4 h-4" />
            Add Generic
        </Button>
    )
}