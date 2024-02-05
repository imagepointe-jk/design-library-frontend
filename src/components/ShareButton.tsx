import { useRef } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/DesignPage.module.css";

type ShareButtonProps = {
  designId: number;
};

const toastUpClassName = "share-button-toast-up";
const toastDisplaySeconds = 1.25;

export function ShareButton({ designId }: ShareButtonProps) {
  const { parentWindowLocation } = useApp();
  const toastRef = useRef(null as HTMLDivElement | null);

  function handleClick() {
    const toast = toastRef.current;
    if (!parentWindowLocation || !toast) return;

    const link = `${parentWindowLocation.origin}${parentWindowLocation.pathname}?designId=${designId}`;
    navigator.clipboard.writeText(link);

    toast.classList.remove(styles[toastUpClassName]);
    toast.style.transition = "0s";
    setTimeout(() => {
      toast.classList.add(styles[toastUpClassName]);
      toast.style.transition = `${toastDisplaySeconds}s`;
    }, 10);
  }

  return (
    <button
      className={styles["share-button"]}
      title="Copy Link"
      onClick={handleClick}
    >
      <i className="fa-solid fa-arrow-up-right-from-square"></i>
      <div
        className={`${styles["share-button-toast"]} ${styles[toastUpClassName]}`}
        ref={toastRef}
      >
        Link copied
      </div>
    </button>
  );
}
