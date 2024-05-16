import { useEffect, useState } from "react";
import { maxComparisonDesigns } from "../constants";
import { Design } from "../dbSchema";
import { getDesignById } from "../fetch";
import { createNavigationUrl } from "../query";
import { getDesignDefaultBackgroundColor } from "../utility";
import { useApp } from "./AppProvider";
import { ImageWithFallback } from "./ImageWithFallback";
import { LoadingIndicator } from "./LoadingIndicator";
import { DesignModalDisplay } from "./Modal";
import styles from "./styles/ComparisonBar.module.css";

export function ComparisonBar() {
  const {
    compareModeData,
    setCompareModeExpanded,
    setCompareModeActive,
    setModalDisplay,
  } = useApp();
  if (
    !compareModeData ||
    !setCompareModeExpanded ||
    !setCompareModeActive ||
    !setModalDisplay
  )
    return <></>;

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
      <div className={styles["buttons-container"]}>
        <a className="disabled-link" href={createNavigationUrl("compare")}>
          <i className="fa-regular fa-eye"></i>Compare Now
        </a>
      </div>
      <button
        className={styles["expand-retract-button"]}
        onClick={clickExpandRetract}
      >
        <i className={`fa-solid fa-chevron-${expanded ? "down" : "up"}`}></i>
        {expanded ? "shrink" : "compare tool"}
      </button>
      <button
        className={styles["close-x"]}
        onClick={() => setCompareModeActive(false)}
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}

function ComparisonSquare({ designId }: { designId?: number }) {
  const [design, setDesign] = useState(null as Design | null);
  const [loading, setLoading] = useState(false);
  const { removeComparisonId, setModalDisplay } = useApp();

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

  if (!removeComparisonId || !setModalDisplay) return <></>;

  return (
    <div className={styles["image-container"]}>
      {loading && <LoadingIndicator />}
      {designId && (
        <>
          <ImageWithFallback
            src={design ? design.imageUrl : "none"}
            className={styles["comparison-image"]}
            onClick={() => setModalDisplay(new DesignModalDisplay(designId))}
            style={{
              backgroundColor: design
                ? getDesignDefaultBackgroundColor(design)
                : "white",
            }}
          />
          <button
            className={styles["remove-button"]}
            onClick={() => removeComparisonId(designId)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </>
      )}
    </div>
  );
}
