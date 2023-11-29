import { ReactNode } from "react";

type ModalProps = {
  children?: ReactNode;
  clickAwayFunction: () => void;
  modalClassName?: string;
};

export function Modal({
  children,
  clickAwayFunction,
  modalClassName,
}: ModalProps) {
  return (
    <div className="modal-bg absolute-fill">
      <div className="absolute-fill" onClick={clickAwayFunction}></div>
      <div className={`modal ${modalClassName}`}>
        {children}
        <div className="modal-x" onClick={clickAwayFunction}>
          X
        </div>
      </div>
    </div>
  );
}
