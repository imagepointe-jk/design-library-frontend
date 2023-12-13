import { DesignQueryParams } from "./types";
import {
  validateDesignResultsJson,
  validateSingleDesignJson,
  validateSubcategories,
} from "./validations";

const serverURL = () =>
  //@ts-ignore
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : //@ts-ignore
      import.meta.env.VITE_SERVER_URL;

export async function getDesigns(queryParamsString: string) {
  console.log(`making request to ${serverURL()}/designs?${queryParamsString}`);
  const response = await fetch(`${serverURL()}/designs?${queryParamsString}`);
  const json = await response.json();
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving designs. Message: ${json.message}`
    );
    throw new Error();
  }
  return validateDesignResultsJson(json);
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

export async function getSubcategories() {
  var requestOptions = {
    method: "GET",
  };

  const response = await fetch(`${serverURL()}/subcategories`, requestOptions);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving subcategories. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateSubcategories(json);
}
