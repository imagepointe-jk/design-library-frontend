// import { Link } from "react-router-dom";
import { handleAnchorClick } from "../utility";
import styles from "./styles/DesignGrid.module.css";

type DesignCardProps = {
  designNumber: number;
  imgUrl: string;
};

export function DesignCard({ designNumber, imgUrl }: DesignCardProps) {
  return (
    <a
      className={styles["design-card"]}
      href={`/designs/${designNumber}`}
      onClick={handleAnchorClick}
    >
      <img
        className={"design-img"}
        src={imgUrl}
        alt={`design ${designNumber}`}
        onError={(e) => {
          (e.target as any).src = "https://placehold.co/300x300?text=Not+Found";
        }}
      />
      <div className={styles["design-card-id"]}>{designNumber}</div>
    </a>
  );
}
