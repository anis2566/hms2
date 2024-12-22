"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { useGetPayments } from "../api/use-get-payments";
import { format } from "date-fns";
import { Edit, FileText, MoreVerticalIcon, Trash2 } from "lucide-react";

interface PaymentListProps {
    patientId: string;
}

export const PaymentList = ({ patientId }: PaymentListProps) => {
    const { data } = useGetPayments(patientId)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>History of payment</CardDescription>
            </CardHeader>
            <CardContent>
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
                                        <Badge className="rounded-full">{payment.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVerticalIcon className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="flex items-center gap-x-3">
                                                    <Edit className="w-5 h-5" />
                                                    <p>Edit</p>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-x-3">
                                                    <FileText className="w-5 h-5" />
                                                    <p>Invoice</p>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group">
                                                    <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                                    <p className="group-hover:text-rose-600">Delete</p>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}