import { useEffect, useState } from "react";
import { maxComparisonDesigns } from "../constants";
import { getDesignById } from "../fetch";
import { TempDesign } from "../sharedTypes";
import { useApp } from "./AppProvider";
import { ImageWithFallback } from "./ImageWithFallback";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/ComparisonBar.module.css";

export function ComparisonBar() {
  const { compareModeData, setCompareModeExpanded } = useApp();
  if (!compareModeData) return <></>;

  const arr = Array.from({ length: maxComparisonDesigns }, () => 0);
  const { expanded, selectedIds: ids } = compareModeData;

  function clickExpandRetract() {
    if (setCompareModeExpanded) setCompareModeExpanded(!expanded);
  }

  return (
    <div className={`${styles["main"]} ${expanded ? styles["expanded"] : ""}`}>
      <div className={styles["images-parent-container"]}>
        {arr.map((_, i) => (
          <ComparisonSquare designId={ids.length > i ? ids[i] : undefined} />
        ))}
      </div>
      <button
        className={styles["expand-retract-button"]}
        onClick={clickExpandRetract}
      >
        <i className={`fa-solid fa-chevron-${expanded ? "down" : "up"}`}></i>
        {expanded ? "shrink" : "compare tool"}
      </button>
    </div>
  );
}

function ComparisonSquare({ designId }: { designId?: number }) {
  const [design, setDesign] = useState(null as TempDesign | null);
  const [loading, setLoading] = useState(false);

  async function getDesignToView() {
    setDesign(null);
    if (!designId) return;

    setLoading(true);
    try {
      const design = await getDesignById(designId);
      setDesign(design);
    } catch (_) {}
    setLoading(false);
  }

  useEffect(() => {
    getDesignToView();
  }, [designId]);

  return (
    <div className={styles["image-container"]}>
      {loading && <LoadingIndicator />}
      {design && (
        <ImageWithFallback
          src={design.ImageURL}
          className={styles["comparison-image"]}
        />
      )}
    </div>
  );
}
