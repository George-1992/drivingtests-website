"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_ALT_PREFIX = "Carousel image";

function normalizeImage(image, index) {
    if (typeof image === "string") {
        return {
            src: image,
            alt: `${DEFAULT_ALT_PREFIX} ${index + 1}`,
        };
    }

    if (!image || typeof image !== "object" || !image.src) {
        return null;
    }

    return {
        src: image.src,
        alt: image.alt || `${DEFAULT_ALT_PREFIX} ${index + 1}`,
        width: image.width,
        height: image.height,
    };
}

function getMotionKeyframes(type, motionDirection) {
    if (type === "vertical") {
        return motionDirection === "down" ? "carousel-scroll-down" : "carousel-scroll-up";
    }

    if (type === "grid") {
        switch (motionDirection) {
            case "right":
                return "carousel-drift-right";
            case "up":
                return "carousel-drift-up";
            case "down":
                return "carousel-drift-down";
            case "left":
            default:
                return "carousel-drift-left";
        }
    }

    return motionDirection === "right" ? "carousel-scroll-right" : "carousel-scroll-left";
}

export default function ImageCarousel({
    images = [],
    type = "horizontal",
    page = false,
    pageSize = 9,
    onPageChange,
    motion = false,
    motionDuration = 24,
    motionDirection,
    className = "",
    imageClassName = "",
    itemClassName = "",
    gapClassName = "gap-4",
    heightClassName = "h-[22rem]",
}) {
    const normalizedImages = images
        .map((image, index) => normalizeImage(image, index))
        .filter(Boolean);

    const [internalPage, setInternalPage] = useState(1);
    const resolvedPageSize = typeof page === "number" ? page : pageSize;
    const safePageSize = Math.max(1, Number(resolvedPageSize) || 9);
    const totalPages = Math.max(1, Math.ceil(normalizedImages.length / safePageSize));
    const currentPage = Math.min(Math.max(1, internalPage), totalPages);
    const paginationEnabled = type === "grid" && Boolean(page) && normalizedImages.length > safePageSize;

    useEffect(() => {
        if (internalPage > totalPages) {
            setInternalPage(totalPages);
        }
    }, [internalPage, totalPages]);

    if (!normalizedImages.length) {
        return null;
    }

    const trackDirection =
        motionDirection || (type === "vertical" ? "up" : type === "grid" ? "left" : "left");
    const animationName = getMotionKeyframes(type, trackDirection);
    const animationStyle = motion
        ? {
            animationName,
            animationDuration: `${Math.max(4, motionDuration)}s`,
            animationTimingFunction: type === "grid" ? "ease-in-out" : "linear",
            animationIterationCount: "infinite",
            animationDirection: type === "grid" ? "alternate" : "normal",
        }
        : undefined;

    function updatePage(nextPage) {
        const clampedPage = Math.min(Math.max(1, nextPage), totalPages);
        if (typeof onPageChange === "function") {
            onPageChange(clampedPage);
        }
        setInternalPage(clampedPage);
    }

    if (type === "grid") {


        const visibleImages = paginationEnabled
            ? normalizedImages
                .filter((img) => img?.src)                                    // ← add this
                .slice((currentPage - 1) * safePageSize, currentPage * safePageSize + 1)
            : normalizedImages.filter((img) => img?.src);


        return (
            <div className={`w-full ${className}`}>
                <div className={`flex w-full flex-wrap content-start ${gapClassName}`} style={animationStyle}>
                    {visibleImages.map((image, index) => (
                        <div
                            key={`${image.src}-${index}`}
                            className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] ${itemClassName}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={image.width || 1200}
                                height={image.height || 900}
                                className={`h-full w-full ${imageClassName || "object-cover "}`}
                            />
                        </div>
                    ))}
                </div>

                {paginationEnabled && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => updatePage(pageNumber)}
                                aria-label={`Go to page ${pageNumber}`}
                                className={`h-3 w-3 rounded-full transition ${pageNumber === currentPage
                                    ? "bg-orange-700"
                                    : "bg-slate-300 hover:bg-slate-400"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                <style jsx>{`
					@keyframes carousel-drift-left {
						from {
							transform: translate3d(0, 0, 0);
						}
						to {
							transform: translate3d(-10px, 0, 0);
						}
					}

					@keyframes carousel-drift-right {
						from {
							transform: translate3d(0, 0, 0);
						}
						to {
							transform: translate3d(10px, 0, 0);
						}
					}

					@keyframes carousel-drift-up {
						from {
							transform: translate3d(0, 0, 0);
						}
						to {
							transform: translate3d(0, -10px, 0);
						}
					}

					@keyframes carousel-drift-down {
						from {
							transform: translate3d(0, 0, 0);
						}
						to {
							transform: translate3d(0, 10px, 0);
						}
					}
				`}</style>
            </div>
        );
    }

    const trackItems = motion ? [...normalizedImages, ...normalizedImages] : normalizedImages;
    const isVertical = type === "vertical";

    return (
        <div className={`w-full overflow-hidden ${className}`}>
            <div className={`overflow-hidden ${heightClassName}`}>
                <div
                    className={`flex ${isVertical ? "flex-col" : "flex-row"} ${gapClassName} w-max ${motion ? "will-change-transform" : ""}`}
                    style={animationStyle}
                >
                    {trackItems.map((image, index) => (
                        <div
                            key={`${image.src}-${index}`}
                            className={`relative shrink-0 overflow-hidden rounded-3xl ${isVertical ? "h-[22rem] w-full" : "w-[18rem] md:w-[22rem]"} ${itemClassName}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={image.width || 1200}
                                height={image.height || 900}
                                className={`${imageClassName || "h-full w-full object-cover"}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
				@keyframes carousel-scroll-left {
					from {
						transform: translate3d(0, 0, 0);
					}
					to {
						transform: translate3d(-50%, 0, 0);
					}
				}

				@keyframes carousel-scroll-right {
					from {
						transform: translate3d(-50%, 0, 0);
					}
					to {
						transform: translate3d(0, 0, 0);
					}
				}

				@keyframes carousel-scroll-up {
					from {
						transform: translate3d(0, 0, 0);
					}
					to {
						transform: translate3d(0, -50%, 0);
					}
				}

				@keyframes carousel-scroll-down {
					from {
						transform: translate3d(0, -50%, 0);
					}
					to {
						transform: translate3d(0, 0, 0);
					}
				}
			`}</style>
        </div>
    );
}
