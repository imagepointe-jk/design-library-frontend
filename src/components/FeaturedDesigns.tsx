import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { TempDesignResults } from "../sharedTypes";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/FeaturedDesigns.module.css";

export function FeaturedDesigns() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesignResults | null
  );
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    getFeaturedDesigns();
  }, []);

  return (
    <div className={styles["main-container"]}>
      <div className={styles["design-row-container"]}>
        {isLoading && <LoadingIndicator />}
        <div className={styles["design-row"]}>
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
      <button className={styles["left-button"]}>{"<"}</button>
      <button className={styles["right-button"]}>{">"}</button>
    </div>
  );
}
