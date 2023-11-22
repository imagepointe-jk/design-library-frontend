import { TempDesign } from "../sharedTypes";
import { DesignCard } from "./DesignCard";

type DesignGridProps = {
  designs: TempDesign[];
};

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className="design-grid">
      {designs.map((design, i) => (
        <DesignCard designId={i + 1} /> //TODO: Make this a real ID
      ))}
    </div>
  );
}
