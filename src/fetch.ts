import { QuoteRequest } from "./sharedTypes";
import { CategoryHierarchy } from "./types";
import {
  validateCategories,
  validateColors,
  validateDesignArrayJson,
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

export async function getDesignsRelatedToId(designId: number) {
  const response = await fetch(
    `${serverURL()}/designs/${designId}?getRelatedToId=true`
  );
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving designs. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateDesignArrayJson(json);
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

export async function getCategories() {
  var requestOptions = {
    method: "GET",
  };

  const response = await fetch(`${serverURL()}/categories`, requestOptions);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving categories. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateCategories(json);
}

export async function getCategoriesWithHierarchy() {
  const categories = await getCategories();
  const subcategories = await getSubcategories();
  const categoriesWithHierarchy: CategoryHierarchy[] = categories.map(
    (category) => {
      const categoryHierarchy: CategoryHierarchy = {
        DesignType: category.DesignType,
        Name: category.Name,
        Subcategories: subcategories.filter(
          (subcategory) => subcategory.ParentCategory === category.Name
        ),
      };
      return categoryHierarchy;
    }
  );

  return categoriesWithHierarchy;
}

export async function getColors() {
  const response = await fetch(`${serverURL()}/colors`);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving colors. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateColors(json);
}

export async function sendQuoteRequest(quoteRequest: QuoteRequest) {
  //@ts-ignore
  const password = import.meta.env.VITE_QUOTE_REQUEST_AUTH_PASSWORD;
  if (!password) {
    throw new Error("Couldn't find the quote request auth password!");
  }
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${password}`);

  const raw = JSON.stringify(quoteRequest);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
  };

  const url = serverURL();
  console.log(`Fetching from ${url}`);

  return fetch(`${url}/quote-request`, requestOptions);
}
