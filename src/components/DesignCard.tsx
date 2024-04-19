import { createNavigationUrl } from "../utility";
import { useApp } from "./AppProvider";
import { ImageWithFallback } from "./ImageWithFallback";
import { DesignModalDisplay } from "./Modal";
import styles from "./styles/DesignGrid.module.css";

type DesignCardProps = {
  designId: number;
  designNumber: string;
  imgUrl: string;
  backgroundColor: string;
};

export function DesignCard({
  designNumber,
  imgUrl,
  designId,
  backgroundColor,
}: DesignCardProps) {
  const {
    setModalDisplay,
    compareModeData,
    tryAddComparisonId,
    removeComparisonId,
  } = useApp();

  function handleClickCard(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (!setModalDisplay) return;

    e.preventDefault();
    setModalDisplay(new DesignModalDisplay(designId));
  }

  function handleMultiselect() {
    if (!tryAddComparisonId || !removeComparisonId) return;
    if (isSelectedForCompare) removeComparisonId(designId);
    else tryAddComparisonId(designId);
  }

  const isSelectedForCompare = compareModeData?.selectedIds.includes(designId);

  return (
    <div className={styles["design-card-parent"]}>
      <a
        className={styles["design-card"]}
        href={createNavigationUrl({ designId })}
        onClick={handleClickCard}
      >
        <div className={styles["img-container"]} style={{ backgroundColor }}>
          <ImageWithFallback
            className={styles["design-img"]}
            src={imgUrl}
            alt={`design ${designNumber}`}
          />
        </div>
        <div className={styles["design-card-id"]}>{designNumber}</div>
      </a>
      {compareModeData?.active && tryAddComparisonId && (
        <>
          <div className={styles["multiselect-checkbox"]}>
            {isSelectedForCompare && <i className="fa-solid fa-check"></i>}
          </div>
          <div
            className={styles["multiselect-container"]}
            onClick={handleMultiselect}
          ></div>
        </>
      )}
    </div>
  );
}
