import { useEffect, useState } from "react";
import { Design } from "../dbSchema";
import { getDesignById } from "../fetch";
import { createNavigationUrl } from "../query";
import { CartItem } from "../types";
import { useApp } from "./AppProvider";
import { ImageWithFallback } from "./ImageWithFallback";
import { LoadingIndicator } from "./LoadingIndicator";
import { QuoteForm } from "./QuoteForm";
import styles from "./styles/CartView.module.css";
import { getFirstHexCodeInString } from "../utility";

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
          {cartData.items.length > 0 &&
            cartData.items.map((item) => (
              <CartRow
                item={item}
                key={`design-${item.designId}-variation-${item.variationId}`}
              />
            ))}
          {cartData.items.length === 0 && (
            <div className={styles["empty-cart-message"]}>(No designs)</div>
          )}
        </div>
        <QuoteForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}

type CartRowProps = {
  item: CartItem;
};

function CartRow({
  item: { garmentColor, designId, variationId },
}: CartRowProps) {
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState(null as Design | null);
  const { removeDesignFromCart } = useApp();

  const variation = design
    ? design.variations.find((variation) => variation.id === variationId)
    : undefined;
  const foundVariation = variation !== undefined;
  const requestedVariation = variationId !== undefined;

  async function getDesignToView() {
    try {
      const design = await getDesignById(designId);
      setDesign(design);
    } catch (_) {}
    setLoading(false);
  }

  function clickRemoveDesign() {
    if (removeDesignFromCart) removeDesignFromCart(designId, variationId);
  }

  useEffect(() => {
    getDesignToView();
  }, []);

  return (
    <div className={styles["design-row"]}>
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <div className={styles["design-row-image-container"]}>
            <ImageWithFallback
              className={styles["design-image"]}
              src={
                variation
                  ? variation.imageUrl
                  : design
                  ? design.imageUrl
                  : "none"
              }
              style={{
                backgroundColor:
                  getFirstHexCodeInString(garmentColor) || "white",
              }}
            />
            <div>
              {design && foundVariation === requestedVariation
                ? `Design #${design.designNumber}`
                : "Not Found"}
            </div>
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
