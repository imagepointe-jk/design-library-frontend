import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { DesignType, TempDesignWithImages } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";
import { NodeScrollView } from "./NodeScrollView";
import { SearchArea } from "./SearchArea";
import styles from "./styles/TopSection.module.css";
import { ImageWithFallback } from "./ImageWithFallback";

export function TopSection() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesignWithImages[] | null
  );
  const [featuredDesignsLoading, setFeaturedDesignsLoading] = useState(true);

  async function getFeaturedDesigns(designType: DesignType) {
    const featuredQueryParams: DesignQueryParams = {
      designType,
      featuredOnly: designType === "Screen Print",
      pageNumber: 1,
      countPerPage: 12,
      sortBy: "priority",
    };
    const queryString = buildDesignQueryParams(featuredQueryParams);
    try {
      setFeaturedDesignsLoading(true);
      const results = await getDesigns(queryString);
      if (!results) throw new Error("No featured designs found.");
      setFeaturedDesigns(results.designs);
      setFeaturedDesignsLoading(false);
    } catch (error) {
      console.error("Failed to fetch featured designs: ", error);
      setFeaturedDesignsLoading(false);
    }
  }

  useEffect(() => {
    getFeaturedDesigns("Screen Print");
  }, []);

  const images = featuredDesigns
    ? featuredDesigns.map((design) => (
        <ImageWithFallback src={design.ImageData[0].url} />
      ))
    : undefined;
  console.log("designs", featuredDesigns);

  return (
    <div className={styles["main"]}>
      <SearchArea />
      <div className={styles["featured-image-container"]}>
        <NodeScrollView nodes={images} isLoading={featuredDesignsLoading} />
      </div>
    </div>
  );
}
