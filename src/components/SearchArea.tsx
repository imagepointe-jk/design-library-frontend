import { designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import { createNavigationUrl } from "../utility";
import { tryParseDesignType } from "../validations";
import styles from "./styles/SearchArea.module.css";

type SearchAreaProps = {
  onChangeDesignType?: (clickedValue: string) => void;
};

export function SearchArea({ onChangeDesignType }: SearchAreaProps) {
  const ownPathName = window.location.pathname;
  const isInModal = ownPathName === "/search"; //should display slightly differently when in modal

  return (
    <form
      onSubmit={submitSearch}
      className={isInModal ? styles["form-in-modal"] : undefined}
    >
      <div className={styles["search-row"]}>
        <input
          type="search"
          placeholder="Search For A Design"
          name="search"
          id="search"
        />
        <button type="submit">Search</button>
      </div>
      {isInModal && (
        <div className={styles["radio-buttons-container"]}>
          {designTypes.map((designType) => (
            <label htmlFor={`search-modal-${designType}`}>
              <input
                type="radio"
                name={"design-type"}
                id={`search-modal-${designType}`}
                defaultChecked={designType === "Screen Print"}
                value={designType}
                onChange={(e) => {
                  if (onChangeDesignType) onChangeDesignType(e.target.value);
                }}
              />
              {designType}
            </label>
          ))}
        </div>
      )}
    </form>
  );
}

export function submitSearch(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const keywords = formData.get("search");
  const designType = tryParseDesignType(`${formData.get("design-type")}`);
  const newParams: DesignQueryParams = {
    designType: designType ? designType : "Screen Print",
    pageNumber: 1,
    keywords: keywords?.toString().split(" "),
    featuredOnly: false,
    allowDuplicateDesignNumbers: true,
  };

  window.location.href = createNavigationUrl(newParams);
}
