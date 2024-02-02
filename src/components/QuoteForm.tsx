import { useRef, useState } from "react";
import { sendQuoteRequest } from "../fetch";
import { requestParentWindowUrlChange } from "../utility";
import {
  validateEmail,
  validatePhone,
  validateQuoteRequest,
} from "../validations";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/QuoteForm.module.css";

type QuoteFormProps = {
  designId: number;
  designNumber: string;
  garmentColor: string;
  onClickBack: () => void;
};

type Status = "success" | "failure";

export function QuoteForm({
  designId,
  designNumber,
  garmentColor,
  onClickBack,
}: QuoteFormProps) {
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null as Status | null);
  const phoneField = useRef(null as HTMLInputElement | null);

  function checkEmail(email: string) {
    try {
      validateEmail(email);
      setInvalidEmail(false);
      return true;
    } catch (_) {
      setInvalidEmail(true);
      return false;
    }
  }

  function checkPhone(phone: number) {
    try {
      validatePhone(phone);
      setInvalidPhone(false);
      return true;
    } catch (_) {
      setInvalidPhone(true);
      return false;
    }
  }

  function handlePhoneNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!phoneField.current) return;

    const formatted = e.target.value.replace(/[^\d]/g, "");
    phoneField.current.value = formatted;
  }

  //TODO: Require phone number to be 9 digits
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = `${formData.get("email")}`;
    const phone = +`${formData.get("phone")}`;
    if (!checkEmail(email) || !checkPhone(phone)) return;

    try {
      const firstName = formData.get("first-name");
      const lastName = formData.get("last-name");
      const union = formData.get("union");
      const comments = formData.get("comments") || "";

      const quoteRequest = validateQuoteRequest({
        firstName,
        lastName,
        email,
        phone,
        union,
        designId,
        comments,
        designNumber,
        garmentColor,
      });
      setSubmittingRequest(true);
      const response = await sendQuoteRequest(quoteRequest);
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message);
      }
      setSubmittingRequest(false);
      setSubmitStatus("success");
    } catch (error) {
      console.error(error);
      setSubmitStatus("failure");
      setSubmittingRequest(false);
    }
  }

  return (
    <div className={styles["main"]}>
      <h2>Request Quote</h2>
      <button className={styles["back"]} onClick={onClickBack}>
        <i className="fa-solid fa-arrow-left"></i>
        Back
      </button>
      <form onSubmit={submit}>
        <input
          type="text"
          name="first-name"
          id="first-name"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last-name"
          id="last-name"
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onBlur={(e) => checkEmail(e.target.value)}
          required
        />
        {invalidEmail && (
          <div>
            <i className="fa-solid fa-triangle-exclamation"></i>Please enter a
            valid email.
          </div>
        )}
        <input
          ref={phoneField}
          type="tel"
          name="phone"
          id="phone"
          placeholder="Phone Number"
          onChange={handlePhoneNumberChange}
          onBlur={(e) => checkPhone(+e.target.value)}
        />
        {invalidPhone && (
          <div>
            <i className="fa-solid fa-triangle-exclamation"></i>Please enter a
            10-digit phone number.
          </div>
        )}
        <input
          type="text"
          name="union"
          id="union"
          placeholder="Union Name"
          required
        />
        <textarea
          name="comments"
          id="comments"
          cols={30}
          rows={10}
          placeholder="Comments (Please specify garment type, sizes, etc.)"
        ></textarea>
        {!submittingRequest && submitStatus !== "success" && (
          <button type="submit">Submit Request</button>
        )}
        {submittingRequest && <LoadingIndicator />}
        {!submittingRequest && submitStatus === "success" && (
          <div>
            <i className="fa-solid fa-circle-check"></i>Request submitted!
          </div>
        )}
        {!submittingRequest && submitStatus === "failure" && (
          <div>
            <i className="fa-solid fa-triangle-exclamation"></i>We're sorry,
            there was an error submitting your request. Feel free to{" "}
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
            for assistance.
          </div>
        )}
      </form>
    </div>
  );
}
