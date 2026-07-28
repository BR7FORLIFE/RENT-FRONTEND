import type { CloudinaryResponse } from "../../features/property-registration/types";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_PRESET_NAME } from "../env";

export async function uploadImage(imgUri: string) {
    const CloudinaryUrlCloud = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const data = new FormData();
    data.append("upload_preset", CLOUDINARY_PRESET_NAME!);
    data.append("file", {
        uri: imgUri,
        name: `image-${Date.now()}.jpg`,
        type: "image/jpeg",
    } as any);

    const req = await fetch(CloudinaryUrlCloud, { method: "POST", body: data });

    if (!req.ok) {
        const error = await req.json();

        throw new Error(
            error.error?.message ?? "Error al cargar la imagen en cloudinary",
        );
    }

    return (await req.json()) as CloudinaryResponse;
}
