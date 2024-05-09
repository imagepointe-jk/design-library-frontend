import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/ComparisonArea.module.css";
import { LoadingIndicator } from "./LoadingIndicator";
import { getDesignById } from "../fetch";
import { TempDesign } from "../sharedTypes";
import { ImageWithFallback } from "./ImageWithFallback";
import {
  createNavigationUrl,
  getDesignDefaultBackgroundColor,
  getFirstHexCodeInString,
  isDesignTransparent,
} from "../utility";
import { BackgroundColorChanger } from "./DesignView";

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
            <ComparisonDesignContainer design={design} />
          ))}
      </div>
      {loadingStatus === "loading" && <LoadingIndicator />}
    </>
  );
}

type ComparisonDesignContainerProps = {
  design: TempDesign;
};
function ComparisonDesignContainer({ design }: ComparisonDesignContainerProps) {
  const [selectedBgColor, setSelectedBgColor] = useState(null as string | null);
  const defaultBgColor = getDesignDefaultBackgroundColor(design);
  let bgColorToUse = getFirstHexCodeInString(selectedBgColor || "");
  if (!bgColorToUse) bgColorToUse = getFirstHexCodeInString(defaultBgColor);
  if (!bgColorToUse) bgColorToUse = "#000000";
  const showColorChanger = isDesignTransparent(design);

  return (
    <div className={styles["card"]}>
      <ImageWithFallback
        src={design.ImageURL}
        style={{ backgroundColor: bgColorToUse }}
      />
      <h3>#{design.DesignNumber}</h3>
      {showColorChanger && (
        <BackgroundColorChanger
          onClickColor={(color) => setSelectedBgColor(color)}
          selectedColor={selectedBgColor}
        />
      )}
      <a
        className={styles["view-link"]}
        href={createNavigationUrl({ designId: design.Id })}
      >
        View Design
      </a>
    </div>
  );
}
