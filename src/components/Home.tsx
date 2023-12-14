import { FeaturedDesigns } from "./FeaturedDesigns";
import { SearchArea } from "./SearchArea";
// import { Link } from "react-router-dom";
import styles from "./styles/Home.module.css";
import { useState } from "react";
import { SearchModal } from "./SearchModal";
import { DesignQueryParams } from "../types";
import { buildDesignQueryParams, handleAnchorClick } from "../utility";
import { useApp } from "./AppProvider";

export function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const paramsForLibraryButton: DesignQueryParams = {
    designType: "Screen Print",
    pageNumber: 1,
    featuredOnly: true,
  };

  return (
    <div className={`inner-body ${styles["main"]}`}>
      <div>
        {/* <h1>Union Designs For Every Occasion</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, qui
          odio? Perspiciatis fuga asperiores molestiae dolore aut, excepturi,
          ipsum vero necessitatibus voluptatum doloremque quae reiciendis, quo
          architecto quaerat autem a!
        </p> */}
        <SearchArea setModalOpen={setModalOpen} />
        <FeaturedDesigns />
        <div className={styles["buttons-flex"]}>
          {/* <Link
            className="link-black"
            to={`/designs/?${buildDesignQueryParams(paramsForLibraryButton)}`}
          >
            View Design Library
          </Link>
          <Link to="/">Art Services</Link> */}
          <a
            className="link-black"
            href={`https://www.imagepointe.com/design-library-new-designs/?${buildDesignQueryParams(
              paramsForLibraryButton
            )}`}
            onClick={handleAnchorClick}
          >
            View Design Library
          </a>
        </div>
        {modalOpen && (
          <SearchModal clickAwayFunction={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
