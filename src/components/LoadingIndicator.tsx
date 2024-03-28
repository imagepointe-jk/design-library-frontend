import { assetPaths } from "../constants";
import styles from "./styles/LoadingSpinner.module.css";

export function LoadingIndicator() {
  return (
    <div className={styles["container"]}>
      <img
        src={assetPaths.spinner1}
        alt="spinner"
        className={styles["spinner"]}
      />
    </div>
  );
}
