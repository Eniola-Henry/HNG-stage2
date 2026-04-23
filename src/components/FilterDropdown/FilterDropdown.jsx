import { useState, useRef, useEffect } from "react";
import "./FilterDropdown.css";

const STATUSES = ["draft", "pending", "paid"];

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="11" height="7" viewBox="0 0 11 7" fill="none"
    className={`filter-dropdown__chevron${isOpen ? " filter-dropdown__chevron--open" : ""}`}
    aria-hidden="true"
  >
    <path d="M1 1l4.5 4.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FilterDropdown({ selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown",   handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown",   handleKey);
    };
  }, []);

  const toggle = (status) =>
    onChange(selected.includes(status) ? selected.filter((s) => s !== status) : [...selected, status]);

  const label = selected.length > 0 ? `Filter (${selected.length})` : "Filter by Status";

  return (
    <div className="filter-dropdown" ref={wrapRef}>
      <button
        className="filter-dropdown__trigger"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Filter invoices by status"
      >
        {label}
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <ul className="filter-dropdown__menu" role="listbox" aria-label="Invoice status filters">
          {STATUSES.map((status) => {
            const isChecked = selected.includes(status);
            return (
              <li key={status} role="option" aria-selected={isChecked}>
                <label className="filter-dropdown__option">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(status)}
                    className="sr-only"
                  />
                  <span className={`filter-dropdown__checkbox${isChecked ? " filter-dropdown__checkbox--checked" : ""}`} aria-hidden="true">
                    {isChecked && <CheckIcon />}
                  </span>
                  <span className="filter-dropdown__label">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
