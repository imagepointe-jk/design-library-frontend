import { TempDesignWithImages } from "../sharedTypes";
import { getDesignDefaultBackgroundColor } from "../utility";
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
          key={design.Id}
          designNumber={design.DesignNumber}
          designId={design.Id}
          imgUrl={design.ImageURLs[0]}
          backgroundColor={getDesignDefaultBackgroundColor(design) || "#000000"}
        />
      ))}
    </div>
  );
}
