import { DesignType, designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import {
  buildDesignQueryParams,
  requestParentWindowUrlChange,
} from "../utility";
import { useApp } from "./AppProvider";
import styles from "./styles/SearchArea.module.css";

export function SearchArea() {
  const { parentWindowLocation } = useApp();
  const ownPathName = window.location.pathname;
  const isInModal = ownPathName === "/search"; //should display slightly differently when in modal

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    if (!parentWindowLocation) return;
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const keywords = formData.get("search");
    const designType = formData.get("design-type");
    const newParams: DesignQueryParams = {
      designType: "Screen Print",
      pageNumber: 1,
      keywords: keywords?.toString().split(" "),
      featuredOnly: true,
      allowDuplicateDesignNumbers: true,
    };
    if ((designType as DesignType) === "Embroidery")
      newParams.designType = "Embroidery";

    requestParentWindowUrlChange(
      `${
        parentWindowLocation.origin
      }/design-library-new-designs/?${buildDesignQueryParams(newParams)}`
    );
  }

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
      <div className={styles["radio-buttons-container"]}>
        {designTypes.map((designType) => (
          <label htmlFor={`search-modal-${designType}`}>
            <input
              type="radio"
              name={"design-type"}
              id={`search-modal-${designType}`}
              defaultChecked={designType === "Screen Print"}
              value={designType}
            />
            {designType}
          </label>
        ))}
      </div>
    </form>
  );
}
