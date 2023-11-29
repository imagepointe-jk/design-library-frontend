import { Modal } from "./Modal";
import { SearchArea } from "./SearchArea";
import styles from "./styles/SearchModal.module.css";

type SearchModalProps = {
  clickAwayFunction: () => void;
};

export function SearchModal({ clickAwayFunction }: SearchModalProps) {
  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log(formData);
  }
  return (
    <Modal
      clickAwayFunction={clickAwayFunction}
      modalClassName={styles["search-modal"]}
    >
      <form onSubmit={submitSearch}>
        <SearchArea isInModal={true} />
        <div className={styles["radio-buttons-container"]}>
          <label htmlFor="screen-print">
            <input type="radio" name="design-type" id="screen-print" />
            Screen Print Designs
          </label>
          <label htmlFor="embroidery">
            <input type="radio" name="design-type" id="embroidery" />
            Embroidery Designs
          </label>
        </div>
      </form>
    </Modal>
  );
}
