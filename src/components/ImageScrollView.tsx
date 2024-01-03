import { useRef, useState } from "react";
import { clamp } from "../utility";
import { ArrowButton } from "./ArrowButton";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/ImageScrollView.module.css";

type ImageScrollViewProps = {
  scrollDistance?: number;
  height?: number;
  images?: string[];
  overrideScrollIndex?: number;
  highlightImageIndex?: number;
  isLoading?: boolean;
  noImagesText?: string;
  onScrollFn?: (scrollDirection: "left" | "right") => void;
  onClickImg?: (clickedIndex: number) => void;
};

const defaultImageSize = 250;
const defaultNoImagesText = "No Images";

export function ImageScrollView({
  scrollDistance,
  images,
  overrideScrollIndex,
  highlightImageIndex,
  onScrollFn,
  onClickImg,
  isLoading,
  noImagesText,
}: ImageScrollViewProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollDistanceToUse = scrollDistance
    ? scrollDistance
    : defaultImageSize;
  const scrollIndexToUse =
    overrideScrollIndex !== undefined ? overrideScrollIndex : scrollIndex;
  const totalImages = images
    ? images.filter((image) => image !== "").length
    : 0;

  function scroll(direction: "left" | "right") {
    const increment = direction === "left" ? -1 : 1;
    const newSliderIndex = clamp(scrollIndex + increment, 0, totalImages - 1);
    setScrollIndex(newSliderIndex);
    if (onScrollFn) {
      onScrollFn(direction);
    }
  }

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
        <div className={styles["designs-overflow-container"]}>
          <div
            className={styles["designs-row"]}
            style={{ left: `${-1 * scrollDistanceToUse * scrollIndexToUse}px` }}
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
        disabled={scrollIndexToUse >= totalImages - 1}
        onClick={() => scroll("right")}
      />
    </div>
  );
}
