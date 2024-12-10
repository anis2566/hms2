"use client"

import { Category } from "@prisma/client"
import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react"
import Link from "next/link"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { CATEGORY_STATUS } from "@/constant"
import { EmptyStat } from "@/components/empty-stat"
import { useDeleteCategory } from "@/hooks/use-category"

interface CategoryListProps {
    categories: Category[]
}

export const CategoryList = ({ categories }: CategoryListProps) => {
    const { onOpen } = useDeleteCategory()

    if (categories.length === 0) {
        return <EmptyStat title="No categories found" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={category.imageUrl} />
                                <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{5}</TableCell>
                        <TableCell>
                            {
                                category.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="mr-2">{tag}</Badge>
                                ))
                            }
                        </TableCell>
                        <TableCell>
                            <Badge className="rounded-full" variant={category.status === CATEGORY_STATUS.Active ? "default" : "destructive"}>{category.status}</Badge>
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
                                        <Link href={`/dashboard/category/edit/${category.id}`} className="flex items-center gap-x-3">
                                            <Edit className="w-5 h-5" />
                                            <p>Edit</p>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(category.id)}>
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
    )
}