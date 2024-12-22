"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useGetPayments } from "../api/use-get-payments"
import { Trash2 } from "lucide-react";
import { MoreVerticalIcon, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const PaymentList = () => {
    const { data } = useGetPayments()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Manage your payments here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-accent hover:bg-accent/80">
                            <TableHead>Patient</TableHead>
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
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src={payment.patient.imageUrl || ""} />
                                                <AvatarFallback>{payment.patient.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium">{payment.patient.name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
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
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/payments/edit/${payment.id}`} className="flex items-center gap-x-3">
                                                        <Edit className="w-5 h-5" />
                                                        <p>Edit</p>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-x-3">
                                                    <RefreshCcw className="w-5 h-5" />
                                                    <p>Change Status</p>
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