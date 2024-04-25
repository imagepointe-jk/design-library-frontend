import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/CartView.module.css";
import { TempDesign } from "../sharedTypes";
import { getDesignById } from "../fetch";
import { LoadingIndicator } from "./LoadingIndicator";
import { ImageWithFallback } from "./ImageWithFallback";

export function CartView() {
  const { cartData } = useApp();

  if (!cartData) return <></>;

  return (
    <>
      <h2>Cart</h2>
      <div className={styles["items-container"]}>
        {cartData.designIds.map((id) => (
          <CartRow designId={id} />
        ))}
      </div>
    </>
  );
}

type CartRowProps = {
  designId: number;
};

function CartRow({ designId }: CartRowProps) {
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState(null as TempDesign | null);

  async function getDesignToView() {
    try {
      const design = await getDesignById(designId);
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
          />
          <div>Design #{design.DesignNumber}</div>
        </>
      )}
    </div>
  );
}
