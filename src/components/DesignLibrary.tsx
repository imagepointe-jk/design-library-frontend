import { DesignGrid } from "./DesignGrid";
import { useParams } from "react-router-dom";
import { DesignModal } from "./DesignModal";

export function DesignLibrary() {
  const { designId: designIdStr } = useParams();
  const designId = designIdStr !== undefined ? +designIdStr : 0;

  return (
    <>
      <h1>Design Library</h1>
      <img
        src="https://www.dropbox.com/scl/fi/6st9np65vhxsdp5n5m7do/American-Benchraft-Leather-Tree-Ornament.png?rlkey=jkcprfki2mxdl2gjr7atfeweg&dl=0"
        alt=""
      />
      <DesignGrid />
      {designId !== undefined && designId > 0 && (
        <DesignModal designId={designId} />
      )}
    </>
  );
}
