import { requestParentWindowUrlChange } from "../utility";

export function ErrorPage() {
  return (
    <>
      <h1>Error</h1>
      <p>
        Something's wrong with our page. We're working hard to fix it! The issue
        might fix itself if you wait, or if you refresh the page. Otherwise,
        feel free to{" "}
        <a
          className="normal-link"
          href="https://www.imagepointe.com/contact-us/"
          onClick={(e) => {
            e.preventDefault();
            requestParentWindowUrlChange(
              "https://www.imagepointe.com/contact-us/"
            );
          }}
        >
          contact us
        </a>{" "}
        and let us know what's wrong.
      </p>
    </>
  );
}
