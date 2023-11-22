import { Link } from "react-router-dom";

type DesignCardProps = {
  designId: number;
};

export function DesignCard({ designId }: DesignCardProps) {
  return (
    <Link className="design-card" to={`/designs/${designId}`}>
      <div className="design-card"></div>
    </Link>
  );
}
