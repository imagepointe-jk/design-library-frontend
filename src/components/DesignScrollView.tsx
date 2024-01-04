import { ImageScrollView } from "./ImageScrollView";
import styles from "./styles/DesignScrollView.module.css";

type DesignScrollViewProps = {
  images?: string[];
  viewedIndex?: number;
  setViewedIndex?: (newIndex: number) => void;
  onScrollFn?: (
    scrollDirection: "left" | "right",
    maxScrollIndex: number
  ) => void;
};

export function DesignScrollView({
  onScrollFn,
  images,
  viewedIndex,
  setViewedIndex,
}: DesignScrollViewProps) {
  return (
    <div className={styles["main"]}>
      <div className={styles["main-img-container"]}>
        <ImageScrollView
          images={images}
          onScrollFn={onScrollFn}
          overrideScrollIndex={viewedIndex}
        />
      </div>
      <div className={styles["nav-img-container"]}>
        <ImageScrollView
          images={images}
          onClickImg={setViewedIndex}
          highlightImageIndex={viewedIndex}
        />
      </div>
    </div>
  );
}
