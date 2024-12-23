import { Doctor } from "@prisma/client";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { SidebarNavs } from "./sidebar-navs";

// import { SidebarNavs } from "./sidebar-navs";

interface Props {
    doctor: Doctor;
    doctorId: string;
}

export const Sidebar = ({ doctor, doctorId }: Props) => {
    return (
        <Card>
            <CardContent className="space-y-4 p-4">
                <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-dotted">
                    <Image
                        src={doctor.imageUrl || "/patient.png"}
                        alt={doctor.name}
                        width={120}
                        height={120}
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col items-center gap-y-1">
                    <h1 className="font-semibold">{doctor.name}</h1>
                    <p className="text-xs text-muted-foreground">{doctor?.email}</p>
                    <p className="text-xs text-muted-foreground">{doctor.phone}</p>
                </div>
                <SidebarNavs doctorId={doctorId} />
            </CardContent>
        </Card>
    );
};