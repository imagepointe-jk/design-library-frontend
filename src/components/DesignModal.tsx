import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";

type DesignModalProps = {
  designId: number;
};

export function DesignModal({ designId }: DesignModalProps) {
  const navigate = useNavigate();
  return <Modal clickAwayFunction={() => navigate(-1)}>{designId}</Modal>;
}
