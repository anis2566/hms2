"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export const RedirectPage = () => {
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get("redirectUrl")


    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl
        }
    }, [redirectUrl])

    return (
        <div className="w-full h-screen flex items-center justify-center text-muted-foreground">
            Redirecting...
        </div>
    )
}