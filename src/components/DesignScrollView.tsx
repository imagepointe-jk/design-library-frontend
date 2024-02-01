import { ImageWithFallback } from "./ImageWithFallback";
import { NodeScrollView } from "./NodeScrollView";
import styles from "./styles/DesignScrollView.module.css";

type DesignScrollViewProps = {
  imageUrls?: string[];
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
  imageUrls,
  viewedIndex,
  setViewedIndex,
  backgroundColor,
  showArrowButtons,
  showNavGallery,
}: DesignScrollViewProps) {
  const navImages = imageUrls
    ? imageUrls.map((url, i) => (
        <ImageWithFallback
          src={url}
          className={`${viewedIndex !== i ? styles["inactive-img"] : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (setViewedIndex) setViewedIndex(i);
          }}
        />
      ))
    : [];
  const mainImages = imageUrls
    ? imageUrls.map((url) => <ImageWithFallback src={url} />)
    : [];
  return (
    <div className={styles["main"]}>
      <div className={styles["main-img-container"]}>
        <div
          className={styles["bg-color-backdrop"]}
          style={{ backgroundColor: backgroundColor || "white" }}
        ></div>
        <NodeScrollView
          nodes={mainImages}
          noNodesText="No Images"
          onScrollFn={onScrollFn}
          overrideScrollIndex={viewedIndex}
          showArrowButtons={showArrowButtons}
        />
      </div>
      {showNavGallery !== false && (
        <div className={styles["nav-img-container"]}>
          <NodeScrollView
            nodes={navImages}
            noNodesText="No Images"
            showArrowButtons={showArrowButtons}
          />
        </div>
      )}
    </div>
  );
}
