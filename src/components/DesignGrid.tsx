import { DesignCard } from "./DesignCard";

export function DesignGrid() {
  const temp = Array.from({ length: 15 }, () => 0);
  return (
    <div className="design-grid">
      {temp.map((_, i) => (
        <DesignCard designId={i + 1} />
      ))}
    </div>
  );
}
