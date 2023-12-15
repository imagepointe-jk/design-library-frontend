import styles from "./styles/SearchArea.module.css";

export function SearchArea() {
  return (
    <div className={styles["search-row"]}>
      <input
        type="search"
        placeholder="Search For A Design"
        name="search"
        id="search"
      />
      <button>Search</button>
    </div>
  );
}
