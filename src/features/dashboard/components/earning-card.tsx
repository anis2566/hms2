import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { EarningChart } from "./earning-chart";

interface Props {
    chartData: { month: string; count: number }[];
    percentage: number;
}

export function EarningCard({ chartData, percentage }: Props) {
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    return (
        <Card className="p-2 md:col-span-2">
            <CardHeader className="p-2">
                <CardTitle className="flex items-center justify-between">
                    <p>Earning Report</p>
                    <div className="flex items-center gap-2 tracking-wider">
                        <Badge className="rounded-full">{percentage > 0 ? "+" : "-"}{percentage}%</Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    Showing total earnings for{" "}
                    <span className="font-bold text-primary">{currentMonth}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
                <EarningChart chartData={chartData} />
            </CardContent>
        </Card>
    );
}