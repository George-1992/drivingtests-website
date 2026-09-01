'use client'

import ImageCarousel from "@/components/other/imageCarusel";
import { logger } from "@/utils/logger";
import { useEffect, useState } from "react";

const n8nEndpoint = 'https://n8n.enspire.science/webhook/29084f50-125a-4ad6-af25-8bb9dc6128d3';

export default function ClientLogos({
    className = "",
    images = [],
    type = "horizontal",
    motion = false,
    motionDuration = 24,
    imageClassName = "",
    itemClassName = "",
    page = 20,
}) {

    const [_images, _setImages] = useState(images);

    useEffect(() => {
        // Fetch client logos from n8n endpoint
        async function body() {
            try {
                const response = await fetch(n8nEndpoint);
                const resJson = await response.json();
                // logger.log("Fetched client logos from n8n:", resJson?.data);
                _setImages(resJson?.data)
            } catch (error) {
                logger.error("Error fetching client logos:", error);
            }
        };
        body();
    }, [])


    return (
        <div className={`${className}`}>
            <ImageCarousel
                images={_images}
                imageClassName={imageClassName}
                itemClassName={itemClassName}
                type={type}
                page={page}
                motion={motion}
                motionDuration={motionDuration}
            // className="my-10"
            // heightClassName="h-[28rem]"
            />
        </div>
    );
}