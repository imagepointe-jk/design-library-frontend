import styles from "./styles/SearchArea.module.css";

type SearchAreaProps = {
  setModalOpen?: (b: boolean) => void;
  isInModal?: boolean; //the version on the homepage and not in the modal will behave slightly differently
};

export function SearchArea({ setModalOpen, isInModal }: SearchAreaProps) {
  return (
    <div className={styles["search-row"]}>
      <input
        type="search"
        placeholder="Search For A Design"
        name="search"
        id="search"
        autoFocus={isInModal}
        autoComplete={isInModal ? "on" : "off"}
        style={{ cursor: setModalOpen ? "pointer" : "initial" }}
      />
      <button>Search</button>
      {!isInModal && (
        <div
          className={styles["input-catcher"]}
          onClick={setModalOpen ? () => setModalOpen(true) : undefined}
        ></div>
      )}
    </div>
  );
}
