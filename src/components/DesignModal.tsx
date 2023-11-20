import { Link } from "react-router-dom";

type DesignModalProps = {
  designId: number;
};

export function DesignModal({ designId }: DesignModalProps) {
  return (
    <div className="modal-bg absolute-fill">
      <Link className="absolute-fill" to="/" />
      <div className="modal">
        Design {designId}
        <Link className="modal-x" to="/">
          X
        </Link>
      </div>
    </div>
  );
}
