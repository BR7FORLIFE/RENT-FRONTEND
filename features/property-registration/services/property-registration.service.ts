import { uploadImage } from "../../../core/configs/cloudinaryconfig";
import type { createResourceImageType } from "../schemas/property-registration.schema";
import { resourcesImageStorage } from "./property-registration.domain.service";

//cargamos las imagenes a cloduinary y retornamos la informacion para ser comprendida
export async function uploadImagesToCloudinary(): Promise<
    createResourceImageType[]
> {
    const imagesUris = await resourcesImageStorage().get(); //obtenemos todas las imagenes del usuario

    if (!imagesUris) {
        throw new Error("Not images saved!"); // se debe de tratar de mejor manera
    }

    const uploadPromises = imagesUris.map(uploadImage);

    const responses = await Promise.all(uploadPromises);

    return responses.map((res) => ({
        url: res.url,
        assetId: res.asset_id,
        format: res.format,
        height: res.height,
        secureUrl: res.secure_url,
        width: res.width,
    }));
}
