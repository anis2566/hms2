"use client";

import { format } from "date-fns";

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetRecentTransactions } from "../api/use-get-recent-transaction";
import { PAYMENT_STATUS } from "@/constant";

export function RecentTransactions() {
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const { data: transactions, isLoading } = useGetRecentTransactions();

    return (
        <Card className="container p-2 md:col-span-2">
            <CardHeader className="p-2">
                <CardTitle className="flex items-center justify-between">
                    <p>Recent Transactions</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm">5.44%</p>
                        <Badge className="rounded-full">+12.44%</Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    Showing recent transactions for{" "}
                    <span className="font-bold text-primary">{currentMonth}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
                {isLoading ? <PaymentListSkeleton /> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                transactions?.map((transaction, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={transaction.patient.imageUrl || ""} />
                                                    <AvatarFallback>{transaction.patient.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium">{transaction.patient.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{format(new Date(transaction.createdAt), "dd MMM yyyy")}</TableCell>
                                        <TableCell>{transaction.amount}</TableCell>
                                        <TableCell>{transaction.method}</TableCell>
                                        <TableCell>
                                            <Badge className="rounded-full" variant={transaction.status === PAYMENT_STATUS.PAID ? "default" : transaction.status === PAYMENT_STATUS.CANCELLED ? "destructive" : "outline"}>{transaction.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}


const PaymentListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}