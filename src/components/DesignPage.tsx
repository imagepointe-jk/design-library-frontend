import { createNavigationUrl } from "../query";
import { DesignView } from "./DesignView";
import styles from "./styles/DesignPage.module.css";

type DesignPageProps = {
  designId: number;
  variationId?: number;
};

export function DesignPage({ designId, variationId }: DesignPageProps) {
  return (
    <div className={styles["main"]}>
      <a href={createNavigationUrl("home")} className={styles["to-library"]}>
        <i className={"fa-solid fa-arrow-left"}></i>To Design Library
      </a>
      <DesignView designId={designId} variationId={variationId} />
    </div>
  );
}
