import { ReactNode } from "react";
import styles from "./styles/Modal.module.css";

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
    <div className={`${styles["modal-bg"]} ${styles["absolute-fill"]}`}>
      <div
        className={styles["absolute-fill"]}
        onClick={clickAwayFunction}
      ></div>
      <div className={`${styles["modal"]} ${modalClassName}`}>
        {children}
        <div className={styles["modal-x"]} onClick={clickAwayFunction}>
          X
        </div>
      </div>
    </div>
  );
}
