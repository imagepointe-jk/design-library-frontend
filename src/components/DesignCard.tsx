import { Link } from "react-router-dom";
import styles from "./styles/DesignGrid.module.css";

type DesignCardProps = {
  designId: number;
  imgUrl: string;
};

export function DesignCard({ designId, imgUrl }: DesignCardProps) {
  return (
    <Link className={styles["design-card"]} to={`/designs/${designId}`}>
      <img
        className={"design-img"}
        src={imgUrl}
        alt={`design ${designId}`}
        onError={(e) => {
          (e.target as any).src = "https://placehold.co/300x300?text=Not+Found";
        }}
      />
      <div className={styles["design-card-id"]}>{designId}</div>
    </Link>
  );
}
