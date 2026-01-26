import styles from "./styles/TopSection.module.css";

export function TopSection() {
  const search = new URLSearchParams(window.location.search);
  search.set("subcategory", "St. Patrick's Day");

  return (
    <div
      className={styles["main"]}
      style={{ flexDirection: "row", justifyContent: "center" }}
    >
      <div className={styles["hero-text"]} style={{ maxWidth: "850px" }}>
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
      <a
        href={`${window.location.origin}${window.location.pathname}?${search}`}
        style={{
          background: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <img
          src="https://imagepointe.com/wp-content/uploads/2026/01/St-Patricks-Day-600-x-600-px.jpg"
          style={{ width: "300px" }}
        />
        <div
          style={{
            backgroundColor: "#2cc922",
            padding: "15px 20px",
            borderRadius: "10px",
            fontWeight: "600",
          }}
        >
          View Designs
        </div>
      </a>
    </div>
  );
}
