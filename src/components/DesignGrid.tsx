import { TempDesignWithImages } from "../sharedTypes";
import { DesignCard } from "./DesignCard";
import styles from "./styles/DesignGrid.module.css";

type DesignGridProps = {
  designs: TempDesignWithImages[];
};

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className={styles["design-grid"]}>
      {designs.map((design) => (
        <DesignCard
          key={design.DesignNumber}
          designNumber={design.DesignNumber}
          imgUrl={design.ImageURLs[0]}
        />
      ))}
    </div>
  );
}
