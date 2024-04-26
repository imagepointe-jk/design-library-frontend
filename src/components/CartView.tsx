import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/CartView.module.css";
import { TempDesign } from "../sharedTypes";
import { getDesignById } from "../fetch";
import { LoadingIndicator } from "./LoadingIndicator";
import { ImageWithFallback } from "./ImageWithFallback";
import { CartDesign } from "../types";
import { getFirstHexCodeInString } from "../utility";

export function CartView() {
  const { cartData } = useApp();

  if (!cartData) return <></>;

  return (
    <>
      <h2>Cart</h2>
      <div className={styles["items-container"]}>
        {cartData.designs.map((design) => (
          <CartRow design={design} />
        ))}
      </div>
    </>
  );
}

type CartRowProps = {
  design: CartDesign;
};

function CartRow({ design: { requestedBackgroundColor, id } }: CartRowProps) {
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState(null as TempDesign | null);

  async function getDesignToView() {
    try {
      const design = await getDesignById(id);
      setDesign(design);
    } catch (_) {}
    setLoading(false);
  }

  useEffect(() => {
    getDesignToView();
  }, []);

  return (
    <div className={styles["design-row"]}>
      {loading && <LoadingIndicator />}
      {!loading && design && (
        <>
          <ImageWithFallback
            className={styles["design-image"]}
            src={design.ImageURL}
            style={{
              backgroundColor:
                getFirstHexCodeInString(requestedBackgroundColor) || undefined,
            }}
          />
          <div>Design #{design.DesignNumber}</div>
        </>
      )}
    </div>
  );
}
