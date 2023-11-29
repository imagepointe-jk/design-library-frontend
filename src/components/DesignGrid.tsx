import { TempDesignWithImage } from "../sharedTypes";
import { DesignCard } from "./DesignCard";
import styles from "./styles/DesignGrid.module.css";

type DesignGridProps = {
  designs: TempDesignWithImage[];
};

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className={styles["design-grid"]}>
      {designs.map((design) => (
        <DesignCard
          key={design.ID}
          designId={design.ID}
          imgUrl={design.ImageURL}
        />
      ))}
    </div>
  );
}
