import { useNavigate } from "react-router-dom";

type DesignModalProps = {
  designId: number;
};

export function DesignModal({ designId }: DesignModalProps) {
  const navigate = useNavigate();
  return (
    <div className="modal-bg absolute-fill">
      <div className="absolute-fill" onClick={() => navigate(-1)} />
      <div className="modal">
        Design {designId}
        <div className="modal-x" onClick={() => navigate(-1)}>
          X
        </div>
      </div>
    </div>
  );
}
