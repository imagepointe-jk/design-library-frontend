import { useRef, useState } from "react";
import { sendQuoteRequest } from "../fetch";
import {
  validateEmail,
  validatePhone,
  validateQuoteRequest,
} from "../validations";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/QuoteForm.module.css";
import { useApp } from "./AppProvider";

type Status = "success" | "failure";
type QuoteFormProps = {
  onSuccess: () => void;
};

export function QuoteForm({ onSuccess }: QuoteFormProps) {
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null as Status | null);
  const { cartData } = useApp();
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
    if (!cartData) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = `${formData.get("email")}`;
    const phone = +`${formData.get("phone")}`;
    if (!checkEmail(email) || !checkPhone(phone)) return;

    try {
      const firstName = formData.get("first-name");
      const lastName = formData.get("last-name");
      const union = formData.get("union");
      const local = formData.get("local");
      const unionWithLocal = `${union} (Local ${local})`;
      const comments = formData.get("comments") || "(no comments)";

      const quoteRequest = validateQuoteRequest({
        firstName,
        lastName,
        email,
        phone,
        union: unionWithLocal,
        designs: cartData.designs,
        comments,
      });
      setSubmittingRequest(true);
      const response = await sendQuoteRequest(quoteRequest);
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message);
      }
      setSubmittingRequest(false);
      setSubmitStatus("success");
      onSuccess();
    } catch (error) {
      console.error(error);
      setSubmitStatus("failure");
      setSubmittingRequest(false);
    }
  }

  return (
    <div className={styles["main"]}>
      <h2>Contact Info</h2>
      <form onSubmit={submit}>
        <div className={styles["horz-inputs"]}>
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
        </div>
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
          placeholder="Union/Organization Name"
          required
        />
        <input
          type="text"
          name="local"
          id="local"
          placeholder="Union Local"
          required
        />
        <textarea
          name="comments"
          id="comments"
          cols={30}
          rows={10}
          placeholder="Comments (Please specify garment type, sizes, quantities, etc.)"
        ></textarea>
        {!submittingRequest && submitStatus !== "success" && (
          <button type="submit">Submit Request</button>
        )}
        {submittingRequest && <LoadingIndicator />}
        {!submittingRequest && submitStatus === "success" && (
          <div>
            <i className="fa-solid fa-circle-check"></i>Request submitted. A
            salesperson will reach out in 1-2 business days.
          </div>
        )}
        {!submittingRequest && submitStatus === "failure" && (
          <div>
            <i className="fa-solid fa-triangle-exclamation"></i>We're sorry,
            there was an error submitting your request. Feel free to{" "}
            <a
              className="normal-link"
              href="https://www.imagepointe.com/contact-us/"
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
