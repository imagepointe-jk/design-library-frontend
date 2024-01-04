import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";
import { ImageScrollView } from "./ImageScrollView";
import { SearchArea } from "./SearchArea";
import styles from "./styles/Home.module.css";
import { useEffect, useState } from "react";
import { TempDesignWithImages } from "../sharedTypes";
import { getDesigns } from "../fetch";

export function Home() {
  const [featuredDesigns, setFeaturedDesigns] = useState(
    null as TempDesignWithImages[] | null
  );
  const [featuredDesignsLoading, setFeaturedDesignsLoading] = useState(true);

  async function getFeaturedDesigns() {
    const featuredQueryParams: DesignQueryParams = {
      designType: "Screen Print",
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

  useEffect(() => {
    getFeaturedDesigns();
  }, []);

  const images = featuredDesigns
    ? featuredDesigns.map((design) => design.ImageURLs[0])
    : undefined;

  return (
    <div className={`inner-body`}>
      <div className={styles["main"]}>
        <SearchArea />
        <div className={styles["featured-image-container"]}>
          <ImageScrollView images={images} isLoading={featuredDesignsLoading} />
        </div>
      </div>
    </div>
  );
}
