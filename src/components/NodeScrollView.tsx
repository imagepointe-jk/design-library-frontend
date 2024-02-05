import { ReactNode, useEffect, useRef, useState } from "react";
import { clamp } from "../utility";
import { ArrowButton } from "./ArrowButton";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/NodeScrollView.module.css";

type NodeScrollViewProps = {
  height?: number;
  nodes?: ReactNode[];
  overrideScrollIndex?: number;
  isLoading?: boolean;
  noNodesText?: string;
  showArrowButtons?: boolean;
  onScrollFn?: (
    scrollDirection: "left" | "right",
    maxScrollIndex: number
  ) => void;
};

const defaultNoNodesText = "No Images";

export function NodeScrollView({
  nodes,
  overrideScrollIndex,
  onScrollFn,
  isLoading,
  noNodesText,
  showArrowButtons,
}: NodeScrollViewProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [maxScrollIndex, setMaxScrollIndex] = useState(0);
  const overflowContainerRef = useRef<null | HTMLDivElement>(null);
  const nodeRowRef = useRef<null | HTMLDivElement>(null);
  const scrollIndexToUse =
    overrideScrollIndex !== undefined ? overrideScrollIndex : scrollIndex;
  const totalNodes = nodes ? nodes.length : 0;
  const scrollDistance = nodeRowRef.current
    ? nodeRowRef.current.getBoundingClientRect().width / totalNodes
    : 0;
  const nodesReady = nodes && totalNodes > 0;

  function calculateMaxScrollIndex() {
    if (!overflowContainerRef.current || !nodeRowRef.current) return 0;

    const totalNodes = nodes ? nodes.length : 0;
    const nodeStripWidth = nodeRowRef.current.getBoundingClientRect().width;
    const viewWidth =
      overflowContainerRef.current.getBoundingClientRect().width;
    const nodeWidth = totalNodes > 0 ? nodeStripWidth / totalNodes : 0;
    const calculated =
      nodeWidth > 0 ? Math.ceil((nodeStripWidth - viewWidth) / nodeWidth) : 0;
    const clampedToNodeCount = clamp(calculated, 0, totalNodes - 1);
    return clampedToNodeCount;
  }

  function scroll(direction: "left" | "right") {
    if (overrideScrollIndex === undefined) {
      const increment = direction === "left" ? -1 : 1;
      const newScrollIndex = scrollIndex + increment;
      const clampedScrollIndex = clamp(newScrollIndex, 0, maxScrollIndex);
      setScrollIndex(clampedScrollIndex);
    }

    if (onScrollFn) {
      onScrollFn(direction, maxScrollIndex);
    }
  }

  function updateMaxScroll() {
    const newMaxScrollIndex = calculateMaxScrollIndex();
    setMaxScrollIndex(newMaxScrollIndex);
  }

  useEffect(() => {
    updateMaxScroll();
  }, [nodes]);

  useEffect(() => {
    if (!nodeRowRef.current) return;

    const resizeObserver = new ResizeObserver(updateMaxScroll);
    resizeObserver.observe(nodeRowRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles["main"]}>
      {!nodesReady && isLoading && <LoadingIndicator />}
      {!nodesReady && !isLoading && (
        <div className={`text-minor ${styles["no-results"]}`}>
          {noNodesText || defaultNoNodesText}
        </div>
      )}

      {!isLoading && totalNodes > 0 && (
        <div
          ref={overflowContainerRef}
          className={styles["nodes-overflow-container"]}
        >
          <div
            ref={nodeRowRef}
            className={styles["nodes-row"]}
            style={{ left: `${-1 * scrollDistance * scrollIndexToUse}px` }}
          >
            {nodes}
          </div>
        </div>
      )}

      {showArrowButtons !== false && (
        <>
          <ArrowButton
            className={styles["left-button"]}
            direction="left"
            disabled={scrollIndexToUse === 0}
            onClick={() => scroll("left")}
          />
          <ArrowButton
            className={styles["right-button"]}
            direction="right"
            disabled={scrollIndexToUse >= maxScrollIndex}
            onClick={() => scroll("right")}
          />
        </>
      )}
    </div>
  );
}
