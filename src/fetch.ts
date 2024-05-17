import { QuoteRequest } from "./sharedTypes";
import {
  validateCategories,
  validateColors,
  validateDesignArrayJson,
  validateDesignResultsJson,
  validateSingleDesignJson,
} from "./validations";

const serverURL = () =>
  //@ts-ignore
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
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
  const response = await fetch(`${serverURL()}/designs/${designId}/related`);
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving designs. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateDesignArrayJson(json);
}

export async function getCategories() {
  var requestOptions = {
    method: "GET",
  };

  const response = await fetch(
    `${serverURL()}/designs/categories`,
    requestOptions
  );
  const json = await response.json();
  if (!response.ok) {
    console.error(
      `Error ${response.status} while retrieving categories. Message: ${json.message}`
    );
    throw new Error();
  }

  return validateCategories(json);
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

  return fetch(`${serverURL()}/designs/quoteRequest`, requestOptions);
}
