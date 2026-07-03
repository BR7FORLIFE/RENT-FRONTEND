import { Cloudinary } from "@cloudinary/url-gen";
import {
    CloudinaryApiKey,
    CloudinaryApiSecret,
    CloudinaryCloudName,
} from "../env";

export const cloudinaryClient = new Cloudinary({
    cloud: {
        cloudName: CloudinaryCloudName,
        apiKey: CloudinaryApiKey,
        apiSecret: CloudinaryApiSecret,
    },
});
