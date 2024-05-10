import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/CartView.module.css";
import { TempDesign } from "../sharedTypes";
import { getDesignById } from "../fetch";
import { LoadingIndicator } from "./LoadingIndicator";
import { ImageWithFallback } from "./ImageWithFallback";
import { CartDesign, DesignQueryParams } from "../types";
import { createNavigationUrl, getFirstHexCodeInString } from "../utility";
import { QuoteForm } from "./QuoteForm";

export function CartView() {
  const { cartData, emptyCart } = useApp();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!cartData) return <></>;
  if (showSuccessMessage)
    return (
      <div className={styles["success-message"]}>
        <i
          className={`fa-regular fa-circle-check ${styles["success-icon"]}`}
        ></i>
        <h2>Success!</h2>
        <p>
          Request submitted. A salesperson will reach out in 1-2 business days.
        </p>
        <a href={createNavigationUrl("home")} className={styles["to-library"]}>
          <i className="fa-solid fa-arrow-left"></i>
          Keep Browsing
        </a>
      </div>
    );

  function onSuccess() {
    setShowSuccessMessage(true);
    if (emptyCart) emptyCart();
  }

  return (
    <div className={styles["main"]}>
      <h2>Quote Request</h2>
      <a href={createNavigationUrl("home")} className={styles["to-library"]}>
        <i className={"fa-solid fa-arrow-left"}></i>Add More Designs
      </a>
      <div className={styles["main-flex"]}>
        <div className={styles["items-container"]}>
          {cartData.designs.length > 0 &&
            cartData.designs.map((design) => (
              <CartRow design={design} key={design.id} />
            ))}
          {cartData.designs.length === 0 && (
            <div className={styles["empty-cart-message"]}>(No designs)</div>
          )}
        </div>
        <QuoteForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}

type CartRowProps = {
  design: CartDesign;
};

function CartRow({ design: { garmentColor, id } }: CartRowProps) {
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState(null as TempDesign | null);
  const { removeDesignFromCart } = useApp();

  async function getDesignToView() {
    try {
      const design = await getDesignById(id);
      setDesign(design);
    } catch (_) {}
    setLoading(false);
  }

  function clickRemoveDesign() {
    if (removeDesignFromCart) removeDesignFromCart(id);
  }

  useEffect(() => {
    getDesignToView();
  }, []);

  return (
    <div className={styles["design-row"]}>
      {loading && <LoadingIndicator />}
      {!loading && design && (
        <>
          <div className={styles["design-row-image-container"]}>
            <ImageWithFallback
              className={styles["design-image"]}
              src={design.ImageURL}
              style={{
                backgroundColor:
                  getFirstHexCodeInString(garmentColor) || undefined,
              }}
            />
            <div>Design #{design.DesignNumber}</div>
          </div>
          <button
            className={styles["remove-button"]}
            onClick={clickRemoveDesign}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </>
      )}
    </div>
  );
}
