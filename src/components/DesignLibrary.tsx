import { DesignGrid } from "./DesignGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { DesignModal } from "./DesignModal";
import { useState, useEffect } from "react";
import { TempDesign } from "../sharedTypes";
import { getDesigns } from "../fetch";

export function DesignLibrary() {
  const { designId: designIdStr } = useParams();
  const [searchParams] = useSearchParams();

  const designId = designIdStr !== undefined ? +designIdStr : 0;
  const [designs, setDesigns] = useState<TempDesign[] | undefined>(undefined);

  async function getDesignsToDisplay() {
    try {
      const fetchedDesigns = await getDesigns(searchParams.toString());
      setDesigns(fetchedDesigns);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  return (
    <>
      <h1>Design Library</h1>
      {designs && <DesignGrid designs={designs} />}
      {designId !== undefined && designId > 0 && (
        <DesignModal designId={designId} />
      )}
    </>
  );
}
