import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/ComparisonArea.module.css";
import { LoadingIndicator } from "./LoadingIndicator";
import { getDesignById } from "../fetch";
import { TempDesign } from "../sharedTypes";
import { ImageWithFallback } from "./ImageWithFallback";
import { createNavigationUrl } from "../utility";

export function ComparisonArea() {
  const { compareModeData } = useApp();
  const [designs, setDesigns] = useState(null as TempDesign[] | null);
  const [loadingStatus, setLoadingStatus] = useState(
    "loading" as "loading" | "error" | "success"
  );

  async function getDesignsToView() {
    if (!compareModeData) return;
    try {
      const designs = await Promise.all(
        compareModeData.selectedIds.map((id) => getDesignById(id))
      );
      setDesigns(designs);
      setLoadingStatus("success");
    } catch (error) {
      console.error(error);
      setLoadingStatus("error");
    }
  }

  useEffect(() => {
    getDesignsToView();
  }, []);

  return (
    <>
      <h2>Design Comparison</h2>
      <div className={styles["cards-container"]}>
        {designs &&
          designs.map((design) => (
            <div className={styles["card"]}>
              <ImageWithFallback src={design.ImageURL} />
              <h3>#{design.DesignNumber}</h3>
              <a href={createNavigationUrl({ designId: design.Id })}>
                View Design
              </a>
            </div>
          ))}
      </div>
      {loadingStatus === "loading" && <LoadingIndicator />}
    </>
  );
}
