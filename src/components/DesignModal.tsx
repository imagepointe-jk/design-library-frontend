import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";
import styles from "./styles/DesignModal.module.css";
import { useState, useEffect } from "react";
import { TempDesignWithImage } from "../sharedTypes";
import { getDesignById } from "../fetch";

type DesignModalProps = {
  designId: number;
};

export function DesignModal({ designId }: DesignModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<TempDesignWithImage | undefined>(
    undefined
  );
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

  async function getDesignToDisplay() {
    try {
      const fetchedDesign = await getDesignById(designId);
      setDesign(fetchedDesign);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDesignToDisplay();
  }, []);

  const temp = Array.from({ length: 7 }, () => 0);
  const bgColorToUse = bgColor ? bgColor : design?.DefaultBackgroundColor;

  return (
    <Modal clickAwayFunction={() => navigate(-1)}>
      {!design && !loading && (
        <>
          <h2>Error</h2>
          <div>
            There was an error displaying design {designId}. Please try again
            later.
          </div>
        </>
      )}
      {design && (
        <div className={styles["main-flex"]}>
          <div>
            <div
              className={styles["main-img-container"]}
              style={{ backgroundColor: bgColorToUse }}
            >
              <img
                className={styles["main-img"]}
                src={design.ImageURL}
                alt={`design ${design.ID}`}
                onError={(e) => {
                  (e.target as any).src =
                    "https://placehold.co/300x300?text=Not+Found";
                }}
              />
              <button className={styles["left-button"]}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button className={styles["right-button"]}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className={styles["gallery-slider-container"]}>
              <div className={styles["gallery-slider"]}>
                {temp.map(() => (
                  <img src={design.ImageURL} /> //TODO: Make this an actual gallery of images associated with this design
                ))}
              </div>
              <button className={styles["gallery-slider-button"]}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className={styles["details-area"]}>
            <div>
              <h2
                className={styles["heading"]}
              >{`${design.Name} (#${design.ID})`}</h2>
              <p className={styles["subheading"]}>
                Design details and description here
              </p>
              <p>{design.Description}</p>
              <a className={styles["try-design-button"]} href="#">
                TRY THIS DESIGN
              </a>
            </div>
            <div>
              <div className={styles["bg-color-container"]}>
                <div>Change Background</div>
                <button className={styles["bg-color-button"]}>
                  <input
                    className={styles["color-picker"]}
                    type="color"
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <img src="/colorwheel.png" alt="color wheel" />
                  <div>Choose a Color</div>
                </button>
              </div>
              <div className={styles["filters-tags-container"]}>
                <div>
                  <p className="bold">Filters</p>
                  <p>
                    {[
                      design.Subcategory1,
                      design.Subcategory2,
                      design.Subcategory3,
                      design.Subcategory4,
                      design.Subcategory5,
                    ]
                      .filter((sub) => sub !== undefined)
                      .map((sub, i, array) => {
                        const onlySubcategory = sub && sub.split(" > ")[1];
                        const comma = i < array.length - 1;
                        return `${onlySubcategory}${comma ? ", " : ""}`;
                      })}
                  </p>
                </div>
                <div>
                  <p className="bold">Search Tags</p>
                  <p>
                    {[
                      design.Tag1,
                      design.Tag2,
                      design.Tag3,
                      design.Tag4,
                      design.Tag5,
                    ]
                      .filter((sub) => sub !== undefined)
                      .map((sub, i, array) => {
                        const comma = i < array.length - 1;
                        return `${sub}${comma ? ", " : ""}`;
                      })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
