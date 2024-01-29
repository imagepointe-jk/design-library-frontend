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
  backgroundColor?: string;
  showArrowButtons?: boolean;
  showNavGallery?: boolean;
};

export function DesignScrollView({
  onScrollFn,
  images,
  viewedIndex,
  setViewedIndex,
  backgroundColor,
  showArrowButtons,
  showNavGallery,
}: DesignScrollViewProps) {
  return (
    <div className={styles["main"]}>
      <div className={styles["main-img-container"]}>
        <div
          className={styles["bg-color-backdrop"]}
          style={{ backgroundColor: backgroundColor || "white" }}
        ></div>
        <ImageScrollView
          images={images}
          onScrollFn={onScrollFn}
          overrideScrollIndex={viewedIndex}
          showArrowButtons={showArrowButtons}
        />
      </div>
      {showNavGallery !== false && (
        <div className={styles["nav-img-container"]}>
          <ImageScrollView
            images={images}
            onClickImg={setViewedIndex}
            highlightImageIndex={viewedIndex}
            showArrowButtons={showArrowButtons}
          />
        </div>
      )}
    </div>
  );
}
