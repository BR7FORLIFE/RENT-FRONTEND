import { File } from "expo-file-system";
import { fetch } from "expo/fetch";
import type { CloudinaryResponse } from "../../features/property-registration/types";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_PRESET_NAME } from "../env";

export async function uploadImage(imgUri: string) {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const file = new File(imgUri);

    const formData = new FormData();

    formData.append("upload_preset", CLOUDINARY_PRESET_NAME!);
    formData.append("file", file);

    const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error?.message ?? "Error al cargar la imagen en Cloudinary",
        );
    }

    return result as CloudinaryResponse;
}
