import { DesignGrid } from "./DesignGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { DesignModal } from "./DesignModal";
import { useState, useEffect } from "react";
import { TempDesignWithImage } from "../sharedTypes";
import { getDesigns } from "../fetch";
import styles from "./styles/DesignLibrary.module.css";

export function DesignLibrary() {
  const { designId: designIdStr } = useParams();
  const [searchParams] = useSearchParams();

  const designId = designIdStr !== undefined ? +designIdStr : 0;
  const [designs, setDesigns] = useState<TempDesignWithImage[] | undefined>(
    undefined
  );

  async function getDesignsToDisplay() {
    try {
      const fetchedDesigns = await getDesigns(searchParams.toString());
      console.log(fetchedDesigns);
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
              <button className={styles["settings-button"]}>
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
  );
}
