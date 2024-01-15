import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";
import { ImageScrollView } from "./ImageScrollView";
import { SearchArea } from "./SearchArea";
import styles from "./styles/Home.module.css";
import { useEffect, useState } from "react";
import { DesignType, TempDesignWithImages } from "../sharedTypes";
import { getDesigns } from "../fetch";
import { tryParseDesignType } from "../validations";

export function Home() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesignWithImages[] | null
  );
  const [featuredDesignsLoading, setFeaturedDesignsLoading] = useState(true);

  async function getFeaturedDesigns(designType: DesignType) {
    const featuredQueryParams: DesignQueryParams = {
      designType,
      featuredOnly: true,
      pageNumber: 1,
      countPerPage: 20,
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

  function onChangeDesignType(clickedValue: string) {
    const parsed = tryParseDesignType(clickedValue);
    if (parsed) getFeaturedDesigns(parsed);
  }

  useEffect(() => {
    getFeaturedDesigns("Screen Print");
  }, []);

  const images = featuredDesigns
    ? featuredDesigns.map((design) => design.ImageURLs[0])
    : undefined;

  return (
    <div className={`inner-body`}>
      <div className={styles["main"]}>
        <SearchArea onChangeDesignType={onChangeDesignType} />
        <div className={styles["featured-image-container"]}>
          <ImageScrollView images={images} isLoading={featuredDesignsLoading} />
        </div>
      </div>
    </div>
  );
}
