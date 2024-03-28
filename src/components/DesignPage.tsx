import { DesignQueryParams } from "../types";
import { createNavigationUrl } from "../utility";
import { DesignView } from "./DesignView";
import styles from "./styles/DesignPage.module.css";

type DesignPageProps = {
  designId: number;
};

export function DesignPage({ designId }: DesignPageProps) {
  const defaultParams: DesignQueryParams = {
    designType: "Screen Print",
    featuredOnly: false,
    pageNumber: 1,
  };
  return (
    <div className={styles["main"]}>
      <a
        href={createNavigationUrl(defaultParams)}
        className={styles["to-library"]}
      >
        <i className={"fa-solid fa-arrow-left"}></i>To Design Library
      </a>
      <DesignView designId={designId} />
    </div>
  );
}
