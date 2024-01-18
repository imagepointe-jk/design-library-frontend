import styles from "./styles/LoadingSpinner.module.css";

export function LoadingIndicator() {
  return (
    <div className={styles["container"]}>
      <img src="/spinner1.png" alt="spinner" className={styles["spinner"]} />
    </div>
  );
}
