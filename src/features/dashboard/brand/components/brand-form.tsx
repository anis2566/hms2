"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Send, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { UploadButton } from "@/lib/uploadthing"
import { LoadingButton } from "@/components/loading-button"
import { BrandSchema, BrandSchemaType } from "../schemas"
import { useCreateBrand } from "../api/use-create-brand"

export const BrandForm = () => {
    const { mutate, isPending } = useCreateBrand()

    const form = useForm<BrandSchemaType>({
        resolver: zodResolver(BrandSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
            description: "",
        }
    })

    const onSubmit = (values: BrandSchemaType) => {
        mutate(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Brand</CardTitle>
                <CardDescription>Add new brand to the system.</CardDescription>
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

                        <FormField
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
                                                    src={form.getValues("imageUrl") || ""}
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