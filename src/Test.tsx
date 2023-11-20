import { useState } from "react";
import { getDropboxFileUrl } from "./fetch";

// @ts-ignore
const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
if (!accessToken) {
  console.error("No access token");
}

export function Test() {
  const [url, setUrl] = useState(undefined as string | undefined);

  async function click() {
    try {
      const imageUrl = await getDropboxFileUrl(
        "/American Benchraft-Leather Tree Ornament.png"
      );
      setUrl(imageUrl);
    } catch (error) {
      console.error("Could not get link");
    }
  }

  return (
    <div>
      {url && <img src={url}></img>}
      <button onClick={click}>Click</button>
    </div>
  );
}
