import { defaultModalHeight } from "../constants";
import { requestParentWindowModalOpen } from "../utility";
import { useApp } from "./AppProvider";
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
    requestParentWindowModalOpen(
      `${designId}`,
      {
        height: defaultModalHeight,
      },
      "default"
    );
  }

  return (
    <a
      className={styles["design-card"]}
      href={`${domain}/design-library-new-designs/?designId=${designId}`}
      onClick={handleClickCard}
    >
      <div className={styles["img-container"]} style={{ backgroundColor }}>
        <img
          className={styles["design-img"]}
          src={imgUrl}
          alt={`design ${designNumber}`}
          onError={(e) => {
            (e.target as any).src =
              "https://placehold.co/300x300?text=Not+Found";
          }}
        />
      </div>
      <div className={styles["design-card-id"]}>{designNumber}</div>
    </a>
  );
}
