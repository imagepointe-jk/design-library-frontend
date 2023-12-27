import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";
import { DesignScrollView } from "./DesignScrollView";
import { FeaturedDesigns } from "./FeaturedDesigns";
import { SearchArea } from "./SearchArea";
import styles from "./styles/Home.module.css";

export function Home() {
  const featuredQueryParams: DesignQueryParams = {
    designType: "Screen Print",
    featuredOnly: true,
    pageNumber: 1,
    countPerPage: 20,
  };
  const queryString = buildDesignQueryParams(featuredQueryParams);
  return (
    <div className={`inner-body`}>
      <div className={styles["main"]}>
        <SearchArea />
        <DesignScrollView queryString={queryString} scrollDistance={200} />
      </div>
    </div>
  );
}
