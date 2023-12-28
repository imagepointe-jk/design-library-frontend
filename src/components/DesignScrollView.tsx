import { useEffect, useRef, useState } from "react";
import styles from "./styles/DesignScrollView.module.css";
import { TempDesignWithImages } from "../sharedTypes";
import { getDesigns } from "../fetch";
import { LoadingIndicator } from "./LoadingIndicator";
import { ArrowButton } from "./ArrowButton";
import { clamp } from "../utility";

type DesignScrollViewProps = {
  queryString?: string;
  scrollDistance?: number;
  width?: number;
  overrideImages?: string[];
  squareContainer?: boolean;
  containerId?: string;
};

const defaultImageSize = 250;

export function DesignScrollView({
  queryString,
  scrollDistance,
  width,
  overrideImages,
  squareContainer,
  containerId,
}: DesignScrollViewProps) {
  const [designs, setDesigns] = useState([] as TempDesignWithImages[]);
  const [isLoading, setIsLoading] = useState(overrideImages === undefined);
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollDistanceToUse = scrollDistance
    ? scrollDistance
    : defaultImageSize;
  const totalImages = overrideImages
    ? overrideImages.filter((image) => image !== "").length
    : designs.length;

  async function queryDesigns() {
    if (!queryString || overrideImages) return;
    setIsLoading(true);
    try {
      const fetchedDesigns = await getDesigns(queryString);
      if (!fetchedDesigns) throw new Error("No designs found.");

      setDesigns(fetchedDesigns.designs);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch preview designs", error);
      setDesigns([]);
      setIsLoading(false);
    }
  }

  function scroll(direction: "left" | "right") {
    const increment = direction === "left" ? -1 : 1;
    const newSliderIndex = clamp(scrollIndex + increment, 0, totalImages - 1);
    setScrollIndex(newSliderIndex);
  }

  useEffect(() => {
    queryDesigns();
    setScrollIndex(0);
  }, [queryString]);

  return (
    <div
      className={styles["main"]}
      id={containerId}
      style={{ width: width, aspectRatio: squareContainer ? 1 : undefined }}
    >
      {!overrideImages && isLoading && <LoadingIndicator />}
      {!overrideImages && !isLoading && designs.length === 0 && (
        <div className={`text-minor ${styles["no-results"]}`}>No Results</div>
      )}

      {!isLoading && totalImages > 0 && (
        <div className={styles["designs-overflow-container"]}>
          <div
            className={styles["designs-row"]}
            style={{ left: `${-1 * scrollDistanceToUse * scrollIndex}px` }}
          >
            {!overrideImages &&
              designs.map((design) => (
                <img
                  className={styles["design-image"]}
                  src={design.ImageURLs[0]}
                />
              ))}
            {overrideImages &&
              overrideImages.map((image) => (
                <>
                  {image !== "" && (
                    <img className={styles["design-image"]} src={image} />
                  )}
                </>
              ))}
          </div>
        </div>
      )}

      <ArrowButton
        className={styles["left-button"]}
        direction="left"
        disabled={scrollIndex === 0}
        onClick={() => scroll("left")}
      />
      <ArrowButton
        className={styles["right-button"]}
        direction="right"
        disabled={scrollIndex >= totalImages - 1}
        onClick={() => scroll("right")}
      />
    </div>
  );
}
