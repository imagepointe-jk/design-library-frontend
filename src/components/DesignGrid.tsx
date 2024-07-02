import { Design } from "../dbSchema";
import { getDesignDefaultBackgroundColor } from "../utility";
import { DesignCard } from "./DesignCard";
import styles from "./styles/DesignGrid.module.css";

type DesignGridProps = {
  designs: Design[];
};

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className={styles["design-grid"]}>
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          designNumber={`${design.designNumber}`}
          designId={design.id}
          imgUrl={design.imageUrl}
          backgroundColor={getDesignDefaultBackgroundColor(design) || "#000000"}
          variationCount={design.variations.length}
        />
      ))}
    </div>
  );
}
