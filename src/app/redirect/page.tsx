import { Metadata } from "next";
import { Suspense } from "react";

import { RedirectPage } from "@/features/auth/components/redirect-page";

export const metadata: Metadata = {
    title: "Redirecting...",
    description: "Redirecting to the requested page...",
};

const Redirect = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RedirectPage />
        </Suspense>
    )
};

export default Redirect;