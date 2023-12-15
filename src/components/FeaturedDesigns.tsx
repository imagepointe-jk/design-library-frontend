import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { TempDesignResults } from "../sharedTypes";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/FeaturedDesigns.module.css";
import { clamp } from "../utility";

const imageSizePx = 200;

export function FeaturedDesigns() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesignResults | null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);

  //? Should we be showing embroidery AND screen print featured designs,
  //? or just one or the other?
  async function getFeaturedDesigns() {
    try {
      const fetchedDesigns = await getDesigns("featured=true");
      setFeaturedDesigns(fetchedDesigns);
      setIsLoading(false);
    } catch (error) {
      console.error("Error while fetching featured designs", error);
      setIsLoading(false);
    }
  }

  function moveSlider(direction: "left" | "right") {
    if (!featuredDesigns) return;
    const increment = direction === "left" ? -1 : 1;
    const newSliderIndex = clamp(
      sliderIndex + increment,
      0,
      featuredDesigns.total
    );
    setSliderIndex(newSliderIndex);
  }

  useEffect(() => {
    getFeaturedDesigns();
  }, []);

  return (
    <div className={styles["main-container"]}>
      <div className={styles["design-row-container"]}>
        {isLoading && <LoadingIndicator />}
        <div
          className={styles["design-row"]}
          style={{ left: `-${sliderIndex * imageSizePx}px` }}
        >
          {featuredDesigns &&
            featuredDesigns.designs.map((design) => (
              <img
                className={styles["design-card"]}
                src={design.ImageURLs[0]}
                alt=""
              />
            ))}
        </div>
      </div>
      <button
        className={styles["left-button"]}
        onClick={() => moveSlider("left")}
      >
        {"<"}
      </button>
      <button
        className={styles["right-button"]}
        onClick={() => moveSlider("right")}
      >
        {">"}
      </button>
    </div>
  );
}
