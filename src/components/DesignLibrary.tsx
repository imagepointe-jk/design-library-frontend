import { DesignGrid } from "./DesignGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { DesignModal } from "./DesignModal";
import { useState, useEffect } from "react";
import { TempDesignWithImages } from "../sharedTypes";
import { getDesigns } from "../fetch";
import styles from "./styles/DesignLibrary.module.css";
import { FilterModal } from "./FilterModal";

export function DesignLibrary() {
  const { designNumber: designNumberStr } = useParams();
  const [searchParams] = useSearchParams();
  const [designs, setDesigns] = useState<TempDesignWithImages[] | undefined>(
    undefined
  );
  const [showFilterModal, setShowFilterModal] = useState(false);

  const designId = designNumberStr !== undefined ? +designNumberStr : 0;

  async function getDesignsToDisplay() {
    try {
      const fetchedDesigns = await getDesigns(searchParams.toString());
      setDesigns(fetchedDesigns);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  const checkboxButtons = [
    {
      label: "New Designs",
      name: "new-designs",
    },
    {
      label: "Best Sellers",
      name: "best-sellers",
    },
    {
      label: "Featured",
      name: "featured",
    },
  ];

  return (
    <>
      <div className={styles["bg"]}>
        <div className="inner-body">
          <p className={styles["library-text"]}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            unde, provident omnis libero corporis minus, voluptas perspiciatis
            deserunt, natus eos eligendi. Impedit veritatis placeat dignissimos
            perferendis possimus distinctio, eos eum!
          </p>
          <div className={styles["search-container"]}>
            <div className={styles["settings-container"]}>
              <div className={styles["settings-subcontainer"]}>
                <label htmlFor="screen-print">
                  <input type="radio" name="design-type" id="screen-print" />
                  Screen Print
                </label>
                <label htmlFor="embroidery">
                  <input type="radio" name="design-type" id="embroidery" />
                  Embroidery
                </label>
              </div>
              <div className={styles["settings-subcontainer"]}>
                {checkboxButtons.map((button) => (
                  <>
                    <input
                      className="button-styled-checkbox"
                      type="checkbox"
                      name={button.name}
                      id={button.name}
                    />
                    <label htmlFor={button.name}>{button.label}</label>
                  </>
                ))}
                <button
                  className={styles["settings-button"]}
                  onClick={() => {
                    console.log("click");
                    setShowFilterModal(true);
                  }}
                >
                  <i className="fa-solid fa-sliders"></i>
                  Filters
                </button>
                <button className={styles["settings-button"]}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Search
                </button>
              </div>
            </div>
            {designs && <DesignGrid designs={designs} />}
            {designId !== undefined && designId > 0 && (
              <DesignModal designId={designId} />
            )}
          </div>
        </div>
      </div>
      {showFilterModal && (
        <FilterModal clickAwayFunction={() => setShowFilterModal(false)} />
      )}
    </>
  );
}
