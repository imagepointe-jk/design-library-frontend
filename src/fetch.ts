import { DesignQueryParams } from "./types";
import { validateDesignsJson } from "./validations";

export async function getDesigns(queryParamsString: string) {
  //@ts-ignore
  const mode = import.meta.env.MODE;
  const serverURL =
    mode === "development" ? "http://localhost:3000" : "<PRODUCTION URL HERE>";

  const response = await fetch(`${serverURL}/designs?${queryParamsString}`);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving designs. Message: ${json.message}`
    );
    throw new Error();
  }
  return validateDesignsJson(json);
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
