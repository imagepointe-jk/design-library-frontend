import styles from "./styles/FeaturedDesigns.module.css";

export function FeaturedDesigns() {
  const temp = Array.from({ length: 10 }, () => 0);
  return (
    <div className={styles["main-container"]}>
      <div className={styles["design-row-container"]}>
        <div className={styles["design-row"]}>
          {temp.map(() => (
            <img className={styles["design-card"]} src="/vite.svg" alt="" />
          ))}
        </div>
      </div>
      <button className={styles["left-button"]}>{"<"}</button>
      <button className={styles["right-button"]}>{">"}</button>
    </div>
  );
}
