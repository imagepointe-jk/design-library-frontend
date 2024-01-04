import { useEffect, useRef, useState } from "react";
import { clamp } from "../utility";
import { ArrowButton } from "./ArrowButton";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/ImageScrollView.module.css";

type ImageScrollViewProps = {
  height?: number;
  images?: string[];
  overrideScrollIndex?: number;
  highlightImageIndex?: number;
  isLoading?: boolean;
  noImagesText?: string;
  onScrollFn?: (
    scrollDirection: "left" | "right",
    maxScrollIndex: number
  ) => void;
  onClickImg?: (clickedIndex: number) => void;
};

const defaultNoImagesText = "No Images";

//TODO: The max scroll index, scroll distance, etc. need to derive from the width of some DOM elements. The below implementation is messy and unreliable. Should be refactored when there is time.
export function ImageScrollView({
  images,
  overrideScrollIndex,
  highlightImageIndex,
  onScrollFn,
  onClickImg,
  isLoading,
  noImagesText,
}: ImageScrollViewProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [maxScrollIndex, setMaxScrollIndex] = useState(0);
  const overflowContainerRef = useRef<null | HTMLDivElement>(null);
  const imageRowRef = useRef<null | HTMLDivElement>(null);
  const scrollIndexToUse =
    overrideScrollIndex !== undefined ? overrideScrollIndex : scrollIndex;
  const totalImages = images
    ? images.filter((image) => image !== "").length
    : 0;
  const scrollDistance = imageRowRef.current
    ? imageRowRef.current.getBoundingClientRect().width / totalImages
    : 0;

  function calculateMaxScrollIndex() {
    if (!overflowContainerRef.current || !imageRowRef.current) return 0;

    const totalImages = images
      ? images.filter((image) => image !== "").length
      : 0;
    const imageStripWidth = imageRowRef.current.getBoundingClientRect().width;
    const viewWidth =
      overflowContainerRef.current.getBoundingClientRect().width;
    const imageWidth = totalImages > 0 ? imageStripWidth / totalImages : 0;
    const calculated =
      imageWidth > 0
        ? Math.ceil((imageStripWidth - viewWidth) / imageWidth)
        : 0;
    const clampedToImgCount = clamp(calculated, 0, totalImages - 1);
    return clampedToImgCount;
  }

  function scroll(direction: "left" | "right") {
    if (overrideScrollIndex === undefined) {
      const increment = direction === "left" ? -1 : 1;
      const newScrollIndex = scrollIndex + increment;
      const clampedScrollIndex = clamp(newScrollIndex, 0, maxScrollIndex);
      setScrollIndex(clampedScrollIndex);
    }

    if (onScrollFn) {
      onScrollFn(direction, maxScrollIndex);
    }
  }

  function updateMaxScroll() {
    const newMaxScrollIndex = calculateMaxScrollIndex();
    setMaxScrollIndex(newMaxScrollIndex);
  }

  useEffect(() => {
    updateMaxScroll();
  }, [images]);

  useEffect(() => {
    if (!imageRowRef.current) return;

    const resizeObserver = new ResizeObserver(updateMaxScroll);
    resizeObserver.observe(imageRowRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const imagesReady =
    images !== undefined && images !== null && totalImages > 0;

  return (
    <div className={styles["main"]}>
      {!imagesReady && isLoading && <LoadingIndicator />}
      {!imagesReady && !isLoading && (
        <div className={`text-minor ${styles["no-results"]}`}>
          {noImagesText || defaultNoImagesText}
        </div>
      )}

      {!isLoading && totalImages > 0 && (
        <div
          ref={overflowContainerRef}
          className={styles["designs-overflow-container"]}
        >
          <div
            ref={imageRowRef}
            className={styles["designs-row"]}
            style={{ left: `${-1 * scrollDistance * scrollIndexToUse}px` }}
          >
            {images &&
              images.map((image, i) => (
                <>
                  {image !== "" && (
                    <img
                      className={`${styles["design-image"]} ${
                        highlightImageIndex !== undefined &&
                        highlightImageIndex !== i
                          ? styles["inactive-img"]
                          : ""
                      }`}
                      src={image}
                      onClick={onClickImg ? () => onClickImg(i) : undefined}
                      style={{ cursor: onClickImg ? "pointer" : undefined }}
                    />
                  )}
                </>
              ))}
          </div>
        </div>
      )}

      <ArrowButton
        className={styles["left-button"]}
        direction="left"
        disabled={scrollIndexToUse === 0}
        onClick={() => scroll("left")}
      />
      <ArrowButton
        className={styles["right-button"]}
        direction="right"
        disabled={scrollIndexToUse >= maxScrollIndex}
        onClick={() => scroll("right")}
      />
    </div>
  );
}
