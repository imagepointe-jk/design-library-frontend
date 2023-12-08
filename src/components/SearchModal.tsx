import { useNavigate } from "react-router-dom";
import { DesignType, designTypes } from "../sharedTypes";
import { useApp } from "./AppProvider";
import { Modal } from "./Modal";
import { SearchArea } from "./SearchArea";
import styles from "./styles/SearchModal.module.css";
import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";

type SearchModalProps = {
  clickAwayFunction: () => void;
};

export function SearchModal({ clickAwayFunction }: SearchModalProps) {
  const navigate = useNavigate();
  const { updateDesignQueryParams } = useApp();

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateDesignQueryParams) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const keywords = formData.get("search");
    const designType = formData.get("design-type");
    const newParams: DesignQueryParams = {
      designType: "Screen Print",
      keywords: keywords?.toString().split(" "),
      featuredOnly: false,
    };
    if ((designType as DesignType) === "Embroidery")
      newParams.designType = "Embroidery";
    const queryString = buildDesignQueryParams(newParams);
    updateDesignQueryParams(newParams, false);
    navigate(`/designs/?${queryString}`);
    clickAwayFunction();
  }
  return (
    <Modal
      clickAwayFunction={clickAwayFunction}
      modalClassName={styles["search-modal"]}
    >
      <form onSubmit={submitSearch}>
        <SearchArea isInModal={true} />
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
    </Modal>
  );
}