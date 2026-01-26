import { Design } from "../dbSchema";
import { getDesignDefaultBackgroundColor } from "../utility";
import { DesignCard } from "./DesignCard";
import { DesignCardGroup } from "./DesignCardGroup";
import styles from "./styles/DesignGrid.module.css";

type DesignGridProps = {
  designs: Design[];
};

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className={styles["design-grid"]}>
      {designs.map((design) => (
        <DesignCardGroup design={design} />
      ))}
    </div>
  );
}
