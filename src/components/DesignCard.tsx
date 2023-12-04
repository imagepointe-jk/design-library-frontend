import { Link } from "react-router-dom";
import styles from "./styles/DesignGrid.module.css";

type DesignCardProps = {
  designNumber: number;
  imgUrl: string;
};

export function DesignCard({ designNumber, imgUrl }: DesignCardProps) {
  return (
    <Link className={styles["design-card"]} to={`/designs/${designNumber}`}>
      <img
        className={"design-img"}
        src={imgUrl}
        alt={`design ${designNumber}`}
        onError={(e) => {
          (e.target as any).src = "https://placehold.co/300x300?text=Not+Found";
        }}
      />
      <div className={styles["design-card-id"]}>{designNumber}</div>
    </Link>
  );
}
