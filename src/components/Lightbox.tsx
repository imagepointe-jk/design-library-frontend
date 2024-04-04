import { useRef, useState } from "react";
import { clamp, getFirstHexCodeInString } from "../utility";
import styles from "./styles/Lightbox.module.css";

export type LightboxImage = {
  url: string;
  backgroundColor: string;
};

export type LightboxData = {
  images: LightboxImage[];
  initialIndex?: number;
};

type LightboxProps = {
  onClickClose: () => void;
  data: LightboxData;
};

export function Lightbox({
  data: { images, initialIndex },
  onClickClose,
}: LightboxProps) {
  const initialIndexClamped = clamp(initialIndex || 0, 0, images.length - 1);
  const [viewIndex, setViewIndex] = useState(initialIndexClamped);
  const [isScrolling, setIsScrolling] = useState(false);
  const imageRef = useRef(null as HTMLImageElement | null);
  const image = images[viewIndex];
  const bgColor = getFirstHexCodeInString(image.backgroundColor);

  const canGoLeft = viewIndex > 0;
  const canGoRight = viewIndex < images.length - 1;

  function onClickArrow(direction: "left" | "right") {
    if (!imageRef.current || isScrolling) return;

    const increment = direction === "left" ? -1 : 1;
    imageRef.current.style.opacity = "0";
    setIsScrolling(true);
    setTimeout(() => {
      if (!imageRef.current) return;
      setViewIndex(clamp(viewIndex + increment, 0, images.length - 1));
      imageRef.current.style.opacity = "1";
      setIsScrolling(false);
    }, 200);
  }

  return (
    <div className={styles["main"]}>
      <div className={styles["image-panel"]}>
        <img
          src={image.url}
          ref={imageRef}
          alt=""
          style={{ backgroundColor: bgColor || "" }}
        />
        <button
          className={`${styles["arrow-button"]} ${styles["left"]}`}
          onClick={() => onClickArrow("left")}
          disabled={!canGoLeft}
        >
          <i className={`fa-solid fa-chevron-left`}></i>
        </button>
        <button
          className={`${styles["arrow-button"]} ${styles["right"]}`}
          onClick={() => onClickArrow("right")}
          disabled={!canGoRight}
        >
          <i className={`fa-solid fa-chevron-right`}></i>
        </button>
      </div>
      <button className={styles["close-x"]} onClick={onClickClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
