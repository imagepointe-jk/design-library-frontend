import { useState } from "react";

export type HierarchyItem = {
  parentName: string;
  selected: boolean;
  onClickParent?: () => void;
  children: {
    childName: string;
    selected: boolean;
    onClickChild: () => void;
  }[];
};

type HierarchyListProps = {
  hierarchy: HierarchyItem[];
  defaultExpandedParent?: string;
  mainClassName?: string;
  parentClassName?: string;
  parentSelectedClassName?: string;
  childClassName?: string;
  childSelectedClassName?: string;
};

export function HierarchyList({
  hierarchy,
  defaultExpandedParent,
  mainClassName,
  parentClassName,
  parentSelectedClassName,
  childClassName,
  childSelectedClassName,
}: HierarchyListProps) {
  const [parentExpanded, setParentExpanded] = useState(null as string | null);
  const parentExpandedToUse = parentExpanded
    ? parentExpanded
    : defaultExpandedParent;

  function handleClickParent(parentName: string) {
    if (parentExpanded === parentName) setParentExpanded(null);
    else setParentExpanded(parentName);
  }

  return (
    <div className={mainClassName}>
      <ul>
        {hierarchy.map((parent) => (
          <li>
            <div
              className={`${parentClassName} ${
                parent.selected ? parentSelectedClassName : ""
              }`}
              onClick={() => {
                handleClickParent(parent.parentName);
                if (parent.onClickParent) parent.onClickParent();
              }}
            >
              {parent.parentName}
            </div>
            {parentExpandedToUse === parent.parentName && (
              <ul>
                {parent.children.map((child) => (
                  <li
                    className={`${childClassName} ${
                      child.selected ? childSelectedClassName : ""
                    }`}
                    onClick={child.onClickChild}
                  >
                    {child.childName}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
