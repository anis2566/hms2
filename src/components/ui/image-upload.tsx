"use client";

import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/uploader";

interface ImageUploadProps {
    values: string[];
    onUploadComplete?: (urls: string[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    path: string;
    name: string;
    extension?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    values = [],
    onUploadComplete,
    multiple = false,
    disabled = false,
    path,
    name,
    extension = "png",
}) => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const handleMultipleImageUpload = async (files: FileList) => {
        const uploadedUrls: string[] = [];
        await Promise.all(
            Array.from(files).map(async (item) => {
                const randomNumber = Math.floor(100000 + Math.random() * 900000);
                const imageUrl = await uploadFile({
                    file: item,
                    path: path,
                    name: `${name}${randomNumber}`,
                    extension,
                });
                uploadedUrls.push(imageUrl.path);
            })
        );
        setSelectedImages((prev) => [...prev, ...uploadedUrls]);
        onUploadComplete?.([...selectedImages, ...uploadedUrls]);
    };

    const handleSingleImageUpload = async (file: File) => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const imageUrl = await uploadFile({
            file,
            path: path,
            name: `${name}${randomNumber}`,
            extension,
        });
        const newImage = imageUrl.path;
        setSelectedImages([newImage]);
        onUploadComplete?.([newImage]);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        if (multiple) {
            await handleMultipleImageUpload(files);
        } else {
            const image = files[0];
            if (image) {
                await handleSingleImageUpload(image);
            }
        }
    };

    const removeSelectedImage = (image: string) => {
        const updatedImages = selectedImages.filter((img) => img !== image);
        setSelectedImages(updatedImages);
        onUploadComplete?.(updatedImages);
    };

    return (
        <div className="space-y-3 h-full">
            <div className={cn("h-full", selectedImages.length > 0 && "hidden")}>
                <label
                    htmlFor="dropzone-file"
                    className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full"
                >
                    <div className="text-center">
                        <div className="border p-2 rounded-md max-w-min mx-auto">
                            <IoCloudUploadOutline size="1.6em" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Select an image</span>
                        </p>
                    </div>
                </label>

                <Input
                    id="dropzone-file"
                    accept="image/png, image/jpeg"
                    type="file"
                    className="hidden"
                    multiple={multiple}
                    onChange={handleImageChange}
                    disabled={disabled}
                />
            </div>

            {values.length > 0 &&
                values.map((image, index) => (
                    <div className="flex items-center justify-between" key={index}>
                        <Image
                            width={100}
                            height={100}
                            src={image}
                            className="w-[80px] h-[80px] object-cover opacity-70 rounded-full border border-gray-300"
                            alt="uploaded image"
                        />
                        <Button type="button" onClick={() => removeSelectedImage(image)} size="icon" variant="destructive">
                            <X size="1.2em" />
                        </Button>
                    </div>
                ))}
        </div>
    );
};

export default ImageUpload;
