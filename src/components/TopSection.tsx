import styles from "./styles/TopSection.module.css";

export function TopSection() {
  return (
    <div className={styles["main"]}>
      <div className={styles["hero-text"]}>
        <h1>
          <span className={styles["blue"]}>Union Designs</span> for Every
          Occasion
        </h1>
        <p>
          Unite your union in style by finding the perfect design from our
          collection created in-house by our Art team. Choose from the screen
          print and embroidery libraries with options to customize with your
          colors, union and local.
        </p>
      </div>
    </div>
  );
}
