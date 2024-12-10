import { Metadata } from "next"
import { redirect } from "next/navigation";

import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { getCurrent } from "@/features/auth/server/action";

export const metadata: Metadata = {
    title: "HMS | Sign Up",
    description: "Create your account"
}

const SignUp = async () => {
    const user = await getCurrent();

    if (user) {
        return redirect("/");
    }

    return <SignUpForm />

}

export default SignUp;