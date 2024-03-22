import { ReactNode } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/Modal.module.css";

type ModalProps = {
  children: ReactNode;
  windowClassName?: string;
};

export function Modal({ children, windowClassName }: ModalProps) {
  const { setModalDisplay } = useApp();
  return (
    <div
      className={styles["bg"]}
      onClick={() => {
        if (setModalDisplay) setModalDisplay(null);
      }}
    >
      <div
        className={`${styles["main"]} ${windowClassName || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className={styles["close-x"]}
          onClick={() => {
            if (setModalDisplay) setModalDisplay(null);
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export class DesignModalDisplay {
  public readonly designId;

  constructor(designId: number) {
    this.designId = designId;
  }
}
