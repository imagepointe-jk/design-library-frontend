import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { DesignType, TempDesign } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import {
  createNavigationUrl,
  buildDesignQueryParams,
  getDesignDefaultBackgroundColor,
} from "../utility";
import { useApp } from "./AppProvider";
import { ImageWithFallback } from "./ImageWithFallback";
import { DesignModalDisplay } from "./Modal";
import { NodeScrollView } from "./NodeScrollView";
import { SearchArea } from "./SearchArea";
import styles from "./styles/TopSection.module.css";

export function TopSection() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesign[] | null
  );
  const [featuredDesignsLoading, setFeaturedDesignsLoading] = useState(true);
  const { setModalDisplay } = useApp();

  async function getFeaturedDesigns(designType: DesignType) {
    const featuredQueryParams: DesignQueryParams = {
      designType,
      featuredOnly: designType === "Screen Print",
      pageNumber: 1,
      countPerPage: 7,
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
    const newParams: DesignQueryParams = {
      featuredOnly: false,
      pageNumber: 1,
      category: "Quick Search",
      subcategory: "Staff Favorites",
      designType: "Screen Print",
    };

    window.location.href = createNavigationUrl(newParams);
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
              src={design.ImageURL}
              onClick={() => {
                if (setModalDisplay)
                  setModalDisplay(new DesignModalDisplay(design.Id));
              }}
            />
          </div>
        ))
        .concat([
          <div className={styles["view-more-card"]}>
            <h3>Staff Favorites</h3>
            <button onClick={handleClickViewMore}>View More</button>
          </div>,
        ])
    : undefined;

  return (
    <div className={styles["main"]}>
      <div className={styles["hero-text"]}>
        <h1>
          <span className={styles["blue"]}>Union Designs</span> for Every
          Occasion
        </h1>
        <p>
          Unite your union in style by finding the perfect design from our
          collection created in-house by our Art team. Choose from the screen
          print and embroidery libraries with options to customize with your
          colors, union and local.
        </p>
      </div>
      <SearchArea />
      <div className={styles["featured-image-container"]}>
        <NodeScrollView nodes={cards} isLoading={featuredDesignsLoading} />
      </div>
    </div>
  );
}
