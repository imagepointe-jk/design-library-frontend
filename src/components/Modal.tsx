import { ReactNode } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/Modal.module.css";

type ModalProps = {
  children: ReactNode;
  windowClassName?: string;
  heightType?: "short" | "medium" | "tall"; //helps make different modal sizes scrollable on vertically short displays
};

export function Modal({ children, windowClassName, heightType }: ModalProps) {
  const { setModalDisplay } = useApp();
  return (
    <div
      className={styles["bg"]}
      onClick={() => {
        if (setModalDisplay) setModalDisplay(null);
      }}
    >
      <div
        className={`${styles["main"]} ${windowClassName || ""} ${
          heightType ? styles[heightType] : ""
        }`}
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
