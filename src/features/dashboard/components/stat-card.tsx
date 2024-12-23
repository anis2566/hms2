import { LucideIcon } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { StatChart } from "./stat-chart";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    chartData: { month: string; count: number }[];
    title: string;
    value: number;
    percentage: number;
    bgColor?: string;
    textColor?: string;
    icon: LucideIcon;
    isLoading: boolean;
}

export const StatCard = ({
    chartData,
    title,
    value,
    percentage,
    bgColor,
    icon: Icon,
    textColor,
    isLoading,
}: Props) => {
    console.log(isLoading);
    return (
        <Card className="p-2">
            <CardHeader className="p-0 px-2">
                <div className="flex items-center gap-x-4">
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md text-primary",
                            bgColor,
                            textColor,
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <p className={cn("text-md font-semibold text-primary", textColor)}>
                        {title}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex items-center justify-center gap-x-3">
                <div className="w-2/3">
                    <StatChart chartData={chartData} />
                </div>
                <div className="space-y-2">
                    <div className="text-md font-semibold">
                        {isLoading ? <Skeleton className="h-4 w-full" /> : `${value}+`}
                    </div>
                    {/* <div className="text-sm text-muted-foreground">
                        {isLoading ? <Skeleton className="h-4 w-full" /> : `+${percentage}%`}
                    </div> */}
                </div>
            </CardContent>
        </Card>
    );
};