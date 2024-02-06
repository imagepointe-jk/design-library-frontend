import { defaultModalHeight } from "../constants";
import {
  requestParentWindowDesignModalOpen,
  requestParentWindowModalOpen,
} from "../utility";
import { useApp } from "./AppProvider";
import { ImageWithFallback } from "./ImageWithFallback";
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
  const { parentWindowLocation } = useApp();
  const domain = parentWindowLocation?.origin;

  function handleClickCard(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    requestParentWindowDesignModalOpen(designId);
  }

  console.log(
    `Design card for design ${designNumber} received image url ${imgUrl}`
  );

  return (
    <a
      className={styles["design-card"]}
      href={`${domain}/design-library/?designId=${designId}`}
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
  );
}
