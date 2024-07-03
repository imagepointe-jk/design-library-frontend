import { useState } from "react";
import { Design } from "../dbSchema";
import { DesignCard } from "./DesignCard";

type Props = {
  design: Design;
};
export function DesignCardGroup({ design }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <DesignCard
        backgroundColor={`#${design.defaultBackgroundColor.hexCode}`}
        designId={design.id}
        designNumber={design.designNumber}
        imgUrl={design.imageUrl}
        variationMessage={
          design.variations.length === 0
            ? undefined
            : !expanded
            ? "+ Show Options"
            : "- Hide Options"
        }
        onClickVariationMessage={() => setExpanded(!expanded)}
      />
      {expanded &&
        design.variations.map((variation) => (
          <DesignCard
            backgroundColor={`#${variation.color.hexCode}`}
            designId={design.id}
            designNumber={design.designNumber}
            imgUrl={variation.imageUrl}
            variationId={variation.id}
          />
        ))}
    </>
  );
}
