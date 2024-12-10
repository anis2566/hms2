"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Send, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { utapi } from 'uploadthing/client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagsInput } from "@/components/ui/tag-input"

import { UploadButton } from "@/lib/uploadthing"
import { LoadingButton } from "@/components/loading-button"
import { CategorySchema, CategorySchemaType } from "../schemas"
import { CATEGORY_STATUS } from "@/constant"
import { useCreateCategory } from "../api/use-create-category"

export const CategoryForm = () => {
    const { mutate, isPending } = useCreateCategory()

    async function uploadFile(file: File) {
        // Generate pre-signed URL
        const { uploadUrl } = await utapi.createUploadUrl({
            name: file.name,
            type: file.type,
        });

        // Upload file
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        console.log('File uploaded successfully');
    }

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            imageUrl: "",
            description: "",
            status: undefined,
            tags: []
        }
    })

    const onSubmit = (values: CategorySchemaType) => {
        mutate(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Category</CardTitle>
                <CardDescription>Add new category to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    uploadFile(file);
                                }
                            }}
                        />

                        {/* <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        {form.getValues("imageUrl") ? (
                                            <div className="relative">
                                                <Image
                                                    alt="Upload"
                                                    width={80}
                                                    height={80}
                                                    className="h-14 w-14 rounded-full"
                                                    src={form.getValues("imageUrl")}
                                                    onError={() => form.setValue("imageUrl", "")}
                                                />
                                                <Button
                                                    className="absolute right-0 top-0"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => form.setValue("imageUrl", "")}
                                                    type="button"
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadButton
                                                endpoint="imageUploader"
                                                onClientUploadComplete={(res) => {
                                                    field.onChange(res[0].url);
                                                    toast.success("Image uploaded");
                                                }}
                                                onUploadError={() => {
                                                    toast.error("Image upload failed");
                                                }}
                                                disabled={isPending}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <TagsInput
                                            value={field.value || []}
                                            onValueChange={field.onChange}
                                            placeholder="enter your used tech"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(CATEGORY_STATUS).map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <LoadingButton
                            isLoading={isPending}
                            title="Create"
                            loadingTitle="Creating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )

}