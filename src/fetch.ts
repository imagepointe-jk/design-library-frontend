import { DesignQueryParams } from "./types";
import { validateDesignsJson, validateSingleDesignJson } from "./validations";

const serverURL = () =>
  //@ts-ignore
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : //@ts-ignore
      import.meta.env.VITE_SERVER_URL;

export async function getDesigns(queryParamsString: string) {
  console.log(`using ${serverURL()}`);
  const response = await fetch(`${serverURL()}/designs?${queryParamsString}`);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving designs. Message: ${json.message}`
    );
    throw new Error();
  }
  return validateDesignsJson(json);
}

export async function getDesignById(designId: number) {
  const response = await fetch(`${serverURL()}/designs/${designId}`);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving designs. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateSingleDesignJson(json);
}

function buildDesignQueryParams(params: DesignQueryParams) {
  const tagsParam = params.tags ? `tags=${params.tags.join(",")}` : "";
  const subcategoriesParam = params.subcategories
    ? `subcategories=${params.subcategories.join(",")}`
    : "";
  const keywordsParam = params.keywords
    ? `keywords=${params.keywords.join(",")}`
    : "";
  const screenPrintParam =
    params.screenPrint !== undefined ? `screenprint=${params.screenPrint}` : "";
  const embroideryParam =
    params.embroidery !== undefined ? `embroidery=${params.embroidery}` : "";

  return [
    tagsParam,
    subcategoriesParam,
    keywordsParam,
    screenPrintParam,
    embroideryParam,
  ].join("&");
}
