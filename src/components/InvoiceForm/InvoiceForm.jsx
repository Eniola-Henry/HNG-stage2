import { useState, useRef, useEffect } from "react";
import { useInvoices } from "../../context/InvoiceContext";
import { todayISO } from "../../utils/invoiceHelpers";
import "./InvoiceForm.css";

/* ── Icons ── */
const TrashIcon = () => (
  <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M8.5 0l.74.74H13v1.48H0V.74h3.76L4.5 0h4zm-7 5.15V16h10V5.15H1.5z"
      fill="currentColor" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M14 2H2a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1z"
      stroke="#7C5DFA" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M11 1v2M5 1v2M1 6h14" stroke="#7C5DFA" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
      flexShrink: 0,
    }}
  >
    <path d="M1 1l4.5 4.5L10 1" stroke="#7C5DFA" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Constants ── */
const PAYMENT_TERMS = [
  { value: 1,  label: "Net 1 Day"   },
  { value: 7,  label: "Net 7 Days"  },
  { value: 14, label: "Net 14 Days" },
  { value: 30, label: "Net 30 Days" },
];

/* ─────────────────────────────────────────────
   CUSTOM PAYMENT TERMS DROPDOWN
   Matches Figma: white box, chevron, list with
   dividers, purple highlight on selected/hover
───────────────────────────────────────────── */
function PaymentTermsDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = PAYMENT_TERMS.find((t) => t.value === value);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="custom-terms" ref={wrapRef}>
      {/* Trigger — same height/border as other inputs */}
      <button
        type="button"
        className="custom-terms__trigger"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selected?.label}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul className="custom-terms__list" role="listbox" aria-label="Payment terms">
          {PAYMENT_TERMS.map((term) => (
            <li
              key={term.value}
              role="option"
              aria-selected={term.value === value}
              className={`custom-terms__option${term.value === value ? " custom-terms__option--selected" : ""}`}
              onClick={() => { onChange(term.value); setIsOpen(false); }}
            >
              {term.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DATE DISPLAY FIELD
   Shows formatted date "21 Aug 2021" with calendar
   icon. Clicking opens the hidden native date input.
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   CUSTOM CALENDAR DATE PICKER
   Fully custom — matches Figma exactly.
   No native date input used.
───────────────────────────────────────────── */
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDisplayDate(isoStr) {
  if (!isoStr) return "Select date";
  const d = new Date(isoStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DateField({ id, value, onChange }) {
  const [isOpen, setIsOpen]     = useState(false);
  const [viewYear,  setViewYear]  = useState(() => value ? new Date(value + "T00:00:00").getFullYear()  : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? new Date(value + "T00:00:00").getMonth()     : new Date().getMonth());
  const wrapRef = useRef(null);

  /* Close on outside click or Escape */
  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown",   handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown",   handleEsc);
    };
  }, []);

  /* Navigate months */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  /* Build the 6-row day grid */
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth     = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const cells = [];

  /* Leading days from previous month */
  for (let i = firstDayOfMonth - 1; i >= 0; i--)
    cells.push({ day: daysInPrevMonth - i, type: "prev" });
  /* Current month days */
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, type: "current" });
  /* Trailing days to fill last row */
  let trailing = 1;
  while (cells.length % 7 !== 0)
    cells.push({ day: trailing++, type: "next" });

  /* Comparison helpers */
  const today    = new Date();
  const selDate  = value ? new Date(value + "T00:00:00") : null;

  const isSelected = (cell) =>
    cell.type === "current" &&
    selDate &&
    selDate.getDate()     === cell.day &&
    selDate.getMonth()    === viewMonth &&
    selDate.getFullYear() === viewYear;

  const isToday = (cell) =>
    cell.type === "current" &&
    today.getDate()     === cell.day &&
    today.getMonth()    === viewMonth &&
    today.getFullYear() === viewYear;

  const handleDayClick = (cell) => {
    if (cell.type !== "current") return;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(cell.day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  return (
    <div className="date-field" ref={wrapRef}>
      {/* Trigger button — styled like a form input */}
      <button
        type="button"
        id={id}
        className={`date-field__trigger${isOpen ? " date-field__trigger--open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Select invoice date"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="date-field__text">{formatDisplayDate(value)}</span>
        <span className="date-field__icon"><CalendarIcon /></span>
      </button>

      {/* Custom calendar popup */}
      {isOpen && (
        <div className="date-field__calendar" role="dialog" aria-label="Date picker">

          {/* Month navigation header */}
          <div className="cal__nav">
            <button
              type="button"
              className="cal__nav-btn"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M5 1L1 5l4 4" stroke="#7C5DFA" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <span className="cal__month-label">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              className="cal__nav-btn"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Day name headers */}
          <div className="cal__grid">
            {DAY_LABELS.map((lbl) => (
              <span key={lbl} className="cal__day-name">{lbl}</span>
            ))}

            {/* Day cells */}
            {cells.map((cell, i) => (
              <button
                key={i}
                type="button"
                className={[
                  "cal__day",
                  cell.type !== "current"      ? "cal__day--other"    : "",
                  isSelected(cell)             ? "cal__day--selected" : "",
                  isToday(cell) && !isSelected(cell) ? "cal__day--today" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => handleDayClick(cell)}
                aria-label={cell.type === "current"
                  ? `${cell.day} ${MONTH_NAMES[viewMonth]} ${viewYear}`
                  : undefined}
                tabIndex={cell.type !== "current" ? -1 : 0}
              >
                {cell.day}
              </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

/* ── Form helpers ── */
const BLANK_FORM = {
  createdAt: todayISO(),
  description: "",
  paymentTerms: 30,
  clientName: "",
  clientEmail: "",
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientAddress:  { street: "", city: "", postCode: "", country: "" },
  items: [],
};

const BLANK_ITEM = { name: "", quantity: 1, price: 0 };

const deepGet = (obj, path) =>
  path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

const deepSet = (obj, path, value) => {
  const next = { ...obj };
  const keys = path.split(".");
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = { ...cursor[keys[i]] };
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
export default function InvoiceForm({ existingInvoice, onClose, onSaved }) {
  const isEditing = Boolean(existingInvoice);
  const { createInvoice, updateInvoice } = useInvoices();

  const panelRef   = useRef(null);
  const firstInput = useRef(null);

  const [form, setForm] = useState(() =>
    isEditing
      ? {
          createdAt:     existingInvoice.createdAt,
          description:   existingInvoice.description,
          paymentTerms:  existingInvoice.paymentTerms,
          clientName:    existingInvoice.clientName,
          clientEmail:   existingInvoice.clientEmail,
          senderAddress: { ...existingInvoice.senderAddress },
          clientAddress: { ...existingInvoice.clientAddress },
          items: existingInvoice.items.map((i) => ({ ...i })),
        }
      : { ...BLANK_FORM, items: [] }
  );

  const [errors,       setErrors]       = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    firstInput.current?.focus();
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const setField = (path, value) => setForm((prev) => deepSet(prev, path, value));

  const setItemField = (index, field, value) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
    }));

  const addItem    = () => setForm((prev) => ({ ...prev, items: [...prev.items, { ...BLANK_ITEM }] }));
  const removeItem = (idx) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim())  e.clientName  = "can't be empty";
    if (!form.clientEmail.trim()) e.clientEmail = "can't be empty";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
      e.clientEmail = "invalid email";
    if (!form.description.trim()) e.description = "can't be empty";

    ["street","city","postCode","country"].forEach((k) => {
      if (!form.senderAddress[k]?.trim()) e[`sa_${k}`] = "can't be empty";
      if (!form.clientAddress[k]?.trim()) e[`ca_${k}`] = "can't be empty";
    });

    if (form.items.length === 0) e._noItems = true;
    form.items.forEach((it, i) => {
      if (!it.name?.trim())                         e[`item_${i}_name`]  = "required";
      if (!it.quantity || Number(it.quantity) <= 0) e[`item_${i}_qty`]   = "required";
      if (it.price === "" || Number(it.price) < 0)  e[`item_${i}_price`] = "required";
    });
    return e;
  };

  const handleSave = (status) => {
    const e = validate();
    setErrors(e);
    setHasSubmitted(true);
    if (Object.keys(e).length > 0) {
      panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (isEditing) {
      updateInvoice(existingInvoice.id, form);
      onSaved?.(existingInvoice.id);
    } else {
      const id = createInvoice(form, status);
      onSaved?.(id);
    }
    onClose();
  };

  const fieldErr = (key) => hasSubmitted && errors[key];
  const labelCls = (key) => (fieldErr(key) ? "invoice-form__label--error" : "");

  return (
    <>
      <div className="invoice-form__overlay" onClick={onClose} aria-hidden="true" />

      <aside
        className="invoice-form__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${existingInvoice.id}` : "Create New Invoice"}
      >
        <div className="invoice-form__content">

          {/* Title */}
          {isEditing ? (
            <h2 className="invoice-form__title">
              Edit <span className="invoice-form__title-hash">#</span>{existingInvoice.id}
            </h2>
          ) : (
            <h2 className="invoice-form__title">New Invoice</h2>
          )}

          {/* Global errors */}
          {hasSubmitted && Object.keys(errors).length > 0 && (
            <div role="alert" className="invoice-form__global-errors">
              {Object.keys(errors).filter((k) => k !== "_noItems").length > 0 && (
                <p className="invoice-form__global-error">- All fields must be added</p>
              )}
              {errors._noItems && (
                <p className="invoice-form__global-error">- An item must be added</p>
              )}
            </div>
          )}

          {/* ── BILL FROM ── */}
          <fieldset className="invoice-form__fieldset">
            <legend className="invoice-form__section-label">Bill From</legend>
            <div className="invoice-form__grid">
              <div className="invoice-form__field">
                <label htmlFor="sa-street" className={`invoice-form__label ${labelCls("sa_street")}`}>
                  Street Address
                  {fieldErr("sa_street") && <span className="invoice-form__err-note">— {errors.sa_street}</span>}
                </label>
                <input
                  ref={firstInput}
                  id="sa-street"
                  className={`invoice-form__input${fieldErr("sa_street") ? " invoice-form__input--error" : ""}`}
                  value={form.senderAddress.street}
                  onChange={(e) => setField("senderAddress.street", e.target.value)}
                />
              </div>
            </div>
            <div className="invoice-form__grid invoice-form__grid--3col" style={{ marginTop: 24 }}>
              {[
                ["sa-city",    "City",      "sa_city",    "senderAddress.city"],
                ["sa-post",    "Post Code", "sa_postCode","senderAddress.postCode"],
                ["sa-country", "Country",   "sa_country", "senderAddress.country"],
              ].map(([id, lbl, ek, path]) => (
                <div className="invoice-form__field" key={id}>
                  <label htmlFor={id} className={`invoice-form__label ${labelCls(ek)}`}>
                    {lbl}
                    {fieldErr(ek) && <span className="invoice-form__err-note">— {errors[ek]}</span>}
                  </label>
                  <input
                    id={id}
                    className={`invoice-form__input${fieldErr(ek) ? " invoice-form__input--error" : ""}`}
                    value={deepGet(form, path) || ""}
                    onChange={(e) => setField(path, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* ── BILL TO ── */}
          <fieldset className="invoice-form__fieldset">
            <legend className="invoice-form__section-label">Bill To</legend>
            <div className="invoice-form__grid">
              {[
                ["ca-name",   "Client's Name",  "clientName",  "clientName"],
                ["ca-email",  "Client's Email", "clientEmail", "clientEmail"],
                ["ca-street", "Street Address", "ca_street",   "clientAddress.street"],
              ].map(([id, lbl, ek, path]) => (
                <div className="invoice-form__field" key={id}>
                  <label htmlFor={id} className={`invoice-form__label ${labelCls(ek)}`}>
                    {lbl}
                    {fieldErr(ek) && <span className="invoice-form__err-note">— {errors[ek]}</span>}
                  </label>
                  <input
                    id={id}
                    type={id === "ca-email" ? "email" : "text"}
                    placeholder={id === "ca-email" ? "e.g. email@example.com" : undefined}
                    className={`invoice-form__input${fieldErr(ek) ? " invoice-form__input--error" : ""}`}
                    value={path.includes(".") ? deepGet(form, path) || "" : form[path] || ""}
                    onChange={(e) =>
                      path.includes(".")
                        ? setField(path, e.target.value)
                        : setField(path, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="invoice-form__grid invoice-form__grid--3col" style={{ marginTop: 24 }}>
              {[
                ["ca-city",    "City",      "ca_city",    "clientAddress.city"],
                ["ca-post",    "Post Code", "ca_postCode","clientAddress.postCode"],
                ["ca-country", "Country",   "ca_country", "clientAddress.country"],
              ].map(([id, lbl, ek, path]) => (
                <div className="invoice-form__field" key={id}>
                  <label htmlFor={id} className={`invoice-form__label ${labelCls(ek)}`}>
                    {lbl}
                    {fieldErr(ek) && <span className="invoice-form__err-note">— {errors[ek]}</span>}
                  </label>
                  <input
                    id={id}
                    className={`invoice-form__input${fieldErr(ek) ? " invoice-form__input--error" : ""}`}
                    value={deepGet(form, path) || ""}
                    onChange={(e) => setField(path, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* ── INVOICE DETAILS ── */}
          <div className="invoice-form__grid invoice-form__grid--2col" style={{ marginTop: 40 }}>

            {/* ── Invoice Date ── */}
            <div className="invoice-form__field">
              <label htmlFor="inv-date" className="invoice-form__label">Invoice Date</label>
              <DateField
                id="inv-date"
                value={form.createdAt}
                onChange={(val) => setField("createdAt", val)}
              />
            </div>

            {/* ── Payment Terms ── */}
            <div className="invoice-form__field">
              <label className="invoice-form__label">Payment Terms</label>
              <PaymentTermsDropdown
                value={form.paymentTerms}
                onChange={(val) => setField("paymentTerms", val)}
              />
            </div>

            {/* Description */}
            <div className="invoice-form__field invoice-form__field--full">
              <label htmlFor="inv-desc" className={`invoice-form__label ${labelCls("description")}`}>
                Project Description
                {fieldErr("description") && (
                  <span className="invoice-form__err-note">— {errors.description}</span>
                )}
              </label>
              <input
                id="inv-desc"
                placeholder="e.g. Graphic Design Service"
                className={`invoice-form__input${fieldErr("description") ? " invoice-form__input--error" : ""}`}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
          </div>

          {/* ── ITEM LIST ── */}
          <h3 className="invoice-form__items-title">Item List</h3>

          {form.items.length > 0 && (
            <div className="invoice-form__item-cols" aria-hidden="true">
              <span>Item Name</span>
              <span>Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>
          )}

          <div role="list" aria-label="Invoice items">
            {form.items.map((item, i) => {
              const lineTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
              return (
                <div key={i} className="invoice-form__item-row" role="listitem">
                  <input
                    aria-label={`Item ${i + 1} name`}
                    className={`invoice-form__input${fieldErr(`item_${i}_name`) ? " invoice-form__input--error" : ""}`}
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => setItemField(i, "name", e.target.value)}
                  />
                  <input
                    aria-label="Quantity"
                    type="number"
                    min="1"
                    className={`invoice-form__input${fieldErr(`item_${i}_qty`) ? " invoice-form__input--error" : ""}`}
                    value={item.quantity}
                    onChange={(e) => setItemField(i, "quantity", e.target.value)}
                  />
                  <input
                    aria-label="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    className={`invoice-form__input${fieldErr(`item_${i}_price`) ? " invoice-form__input--error" : ""}`}
                    value={item.price}
                    onChange={(e) => setItemField(i, "price", e.target.value)}
                  />
                  <span className="invoice-form__item-total">
                    £{lineTotal.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="invoice-form__item-delete"
                    onClick={() => removeItem(i)}
                    aria-label={`Remove item ${i + 1}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>

          {hasSubmitted && errors._noItems && (
            <p className="invoice-form__items-error" role="alert">
              — An item must be added
            </p>
          )}

          <button type="button" className="invoice-form__add-item-btn" onClick={addItem}>
            + Add New Item
          </button>

          {/* ── ACTION BUTTONS ── */}
          <div className="invoice-form__actions">
            {!isEditing && (
              <button type="button" className="btn btn-edit" onClick={onClose}>
                Discard
              </button>
            )}

            <span className="invoice-form__spacer" />

            {!isEditing && (
              <button type="button" className="btn btn-draft" onClick={() => handleSave("draft")}>
                Save as Draft
              </button>
            )}

            {isEditing && (
              <button type="button" className="btn btn-edit" onClick={onClose}>
                Cancel
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSave(isEditing ? undefined : "pending")}
            >
              {isEditing ? "Save Changes" : "Save & Send"}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}