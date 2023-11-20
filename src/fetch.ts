// @ts-ignore
const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
if (!accessToken) {
  console.error("Could not find Dropbox access token!");
}
const apiUrl = "https://content.dropboxapi.com/2/files/download";

export async function getDropboxFileUrl(filePath: string) {
  const storedUrl = localStorage.getItem(filePath);
  if (storedUrl) return storedUrl;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const raw = JSON.stringify({
    path: filePath,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch(apiUrl, requestOptions);
  const status = response.status;
  const json = await response.json();
  if (!response.ok) {
    console.error(`Error ${status}`, json);
    throw new Error("Error getting file link");
  }

  const url = json.link as string;
  localStorage.setItem(filePath, url);
  return url;
}
