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
  parentExpandedClassName?: string;
  childClassName?: string;
  childSelectedClassName?: string;
};

export function HierarchyList({
  hierarchy,
  defaultExpandedParent,
  mainClassName,
  parentClassName,
  parentSelectedClassName,
  parentExpandedClassName,
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
              } ${
                parentExpandedToUse === parent.parentName
                  ? parentExpandedClassName
                  : ""
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
