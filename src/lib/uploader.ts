"use server";

import { promises as fs } from "fs";

interface UploadFileProps {
  file: File;
  path: string;
  name: string;
  extension: string;
}

export const uploadFile = async ({
  file,
  path,
  name,
  extension,
}: UploadFileProps) => {
  try {
    const data = await file.arrayBuffer();
    const fileName = `${name}${Date.now()}.${extension}`;
    await fs.writeFile(
      `${process.cwd()}/public/${path}/${fileName}`,
      Buffer.from(data)
    );
    return { path: `/${path}/${fileName}` };
  } catch {
    throw new Error("Faild to upload");
  }
};

interface DeleteFileProps {
  fileName: string;
}

export const deleteFile = async ({ fileName }: DeleteFileProps) => {
  await fs.unlink(`${process.cwd()}/public/${fileName}`);
};
