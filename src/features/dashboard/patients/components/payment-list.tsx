"use client"

import { format } from "date-fns";
import { Edit, FileText, MoreVerticalIcon, RefreshCcw, Trash2 } from "lucide-react";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { useGetPayments } from "../api/use-get-payments";
import { PAYMENT_STATUS } from "@/constant";
import { usePaymentDelete, usePaymentStatus } from "@/hooks/use-payment";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./payment-header";

interface PaymentListProps {
    patientId: string;
}

export const PaymentList = ({ patientId }: PaymentListProps) => {
    const { onOpen } = usePaymentStatus()
    const { onOpen: onOpenDelete } = usePaymentDelete()

    const { data, isLoading } = useGetPayments(patientId)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>History of payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <PaymentListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    data?.payments.map((payment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(payment.createdAt), "dd MMM yyyy")}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{payment.method}</TableCell>
                                            <TableCell>
                                                <Badge className="rounded-full" variant={payment.status === PAYMENT_STATUS.PAID ? "default" : payment.status === PAYMENT_STATUS.CANCELLED ? "destructive" : "outline"}>{payment.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVerticalIcon className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/payments/edit/${payment.id}?redirectUrl=/dashboard/patients/${patientId}/payments`} className="flex items-center gap-x-3">
                                                                <Edit className="w-5 h-5" />
                                                                <p>Edit</p>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(payment.id, payment.status as PAYMENT_STATUS.PENDING)}>
                                                            <RefreshCcw className="w-5 h-5" />
                                                            <p>Change Status</p>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-x-3">
                                                            <FileText className="w-5 h-5" />
                                                            <p>Invoice</p>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(payment.id)}>
                                                            <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                                            <p className="group-hover:text-rose-600">Delete</p>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )
                }
                {!isLoading && data?.payments.length === 0 && <EmptyStat title="No payment found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


const PaymentListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
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