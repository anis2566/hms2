"use client";

import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onUploadComplete?: (url: File | File[]) => void;
    multiple?: boolean;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, multiple = false, disabled = false }) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (multiple) {
            const images = event.target.files;
            if (images) {
                setSelectedImages([...selectedImages, ...Array.from(images)]);
                onUploadComplete?.([...selectedImages, ...Array.from(images)]);
            }
        } else {
            const image = event.target.files?.[0];
            if (image) {
                setSelectedImages([image]);
                onUploadComplete?.(image);
            }
        }
    };

    const removeSelectedImage = (image: File) => {
        setSelectedImages(selectedImages.filter((img) => img.name !== image.name));
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

            {
                selectedImages.length > 0 && selectedImages.map((image) => (
                    <div className="flex items-center justify-between" key={image.name}>
                        <Image
                            width={100}
                            height={100}
                            src={URL.createObjectURL(image)}
                            className="w-[80px] h-[80px] object-cover opacity-70 rounded-full border border-gray-300"
                            alt="uploaded image"
                        />
                        <Button onClick={() => removeSelectedImage(image)} size="icon" variant="destructive">
                            <X size="1.2em" />
                        </Button>
                    </div>
                ))
            }
        </div>
    );
};

export default ImageUpload;