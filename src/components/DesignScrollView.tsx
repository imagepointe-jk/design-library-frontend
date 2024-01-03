import { ImageScrollView } from "./ImageScrollView";
import styles from "./styles/DesignScrollView.module.css";

type DesignScrollViewProps = {
  mainScrollDistance?: number;
  images?: string[];
  viewedIndex?: number;
  setViewedIndex?: (newIndex: number) => void;
  onScrollFn?: (scrollDirection: "left" | "right") => void;
};

export function DesignScrollView({
  onScrollFn,
  images,
  viewedIndex,
  setViewedIndex,
  mainScrollDistance,
}: DesignScrollViewProps) {
  return (
    <div className={styles["main"]}>
      <div className={styles["main-img-container"]}>
        <ImageScrollView
          images={images}
          scrollDistance={mainScrollDistance}
          onScrollFn={onScrollFn}
          overrideScrollIndex={viewedIndex}
        />
      </div>
      <div className={styles["nav-img-container"]}>
        <ImageScrollView
          images={images}
          scrollDistance={100}
          onClickImg={setViewedIndex}
          highlightImageIndex={viewedIndex}
        />
      </div>
    </div>
  );
}
