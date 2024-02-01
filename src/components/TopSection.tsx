import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { DesignType, TempDesignWithImages } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import {
  buildDesignQueryParams,
  getDesignDefaultBackgroundColor,
  requestParentWindowDesignModalOpen,
  requestParentWindowQueryChange,
} from "../utility";
import { NodeScrollView } from "./NodeScrollView";
import { SearchArea } from "./SearchArea";
import styles from "./styles/TopSection.module.css";
import { ImageWithFallback } from "./ImageWithFallback";
import { useApp } from "./AppProvider";

export function TopSection() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesignWithImages[] | null
  );
  const [featuredDesignsLoading, setFeaturedDesignsLoading] = useState(true);
  const { parentWindowLocation } = useApp();

  async function getFeaturedDesigns(designType: DesignType) {
    const featuredQueryParams: DesignQueryParams = {
      designType,
      featuredOnly: designType === "Screen Print",
      pageNumber: 1,
      countPerPage: 9,
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

  function handleClickViewMore() {
    if (!parentWindowLocation) return;

    const newParams: DesignQueryParams = {
      featuredOnly: true,
      pageNumber: 1,
      category: "Holiday",
      subcategory: "St. Patrick's Day",
      designType: "Screen Print",
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  useEffect(() => {
    getFeaturedDesigns("Screen Print");
  }, []);

  const cards = featuredDesigns
    ? featuredDesigns
        .map((design) => (
          <div
            style={{
              height: "100%",
              backgroundColor:
                getDesignDefaultBackgroundColor(design) || "#000000",
            }}
          >
            <ImageWithFallback
              className={styles["featured-image"]}
              src={design.ImageData[0].url}
              onClick={() => requestParentWindowDesignModalOpen(design.Id)}
            />
          </div>
        ))
        .concat([
          <div className={styles["view-more-card"]}>
            <h3>St. Patrick's Day Designs</h3>
            <button onClick={handleClickViewMore}>View More</button>
          </div>,
        ])
    : undefined;

  return (
    <div className={styles["main"]}>
      <SearchArea />
      <div className={styles["featured-image-container"]}>
        <NodeScrollView nodes={cards} isLoading={featuredDesignsLoading} />
      </div>
    </div>
  );
}
