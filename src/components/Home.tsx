import { FeaturedDesigns } from "./FeaturedDesigns";
import { SearchArea } from "./SearchArea";
import styles from "./styles/Home.module.css";

export function Home() {
  return (
    <div className={`inner-body`}>
      <div className={styles["main"]}>
        <SearchArea />
        <FeaturedDesigns />
      </div>
    </div>
  );
}
