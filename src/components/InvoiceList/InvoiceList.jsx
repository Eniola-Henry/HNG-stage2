import { useState } from "react";
import { useInvoices } from "../../context/InvoiceContext";
import InvoiceCard from "../InvoiceCard/InvoiceCard";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import EmptyState from "../EmptyState/EmptyState";
import "./InvoiceList.css";

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path d="M6.3.5v4.2H10.5v1.6H6.3V10.5H4.7V6.3H.5V4.7h4.2V.5z" fill="white" />
  </svg>
);

export default function InvoiceList({ onSelectInvoice, onNewInvoice }) {
  const { invoices } = useInvoices();
  const [filters, setFilters] = useState([]);

  const visibleInvoices =
    filters.length === 0
      ? invoices
      : invoices.filter((inv) => filters.includes(inv.status));

  const totalLabel =
    visibleInvoices.length === 0
      ? "No invoices"
      : `There are ${visibleInvoices.length} total invoice${visibleInvoices.length !== 1 ? "s" : ""}`;

  return (
    <div className="page-inner">
      {/* ── Header ── */}
      <header className="invoice-list__header">
        <div className="invoice-list__heading">
          <h1 className="invoice-list__title">Invoices</h1>
          <p className="invoice-list__count" aria-live="polite">{totalLabel}</p>
        </div>

        <div className="invoice-list__controls">
          <FilterDropdown selected={filters} onChange={setFilters} />

          <button
            className="btn btn-primary invoice-list__new-btn"
            onClick={onNewInvoice}
            aria-label="Create new invoice"
          >
            <span className="invoice-list__new-icon" aria-hidden="true">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
            </span>
            <span>New <span className="invoice-list__new-full">Invoice</span></span>
          </button>
        </div>
      </header>

      {/* ── List or empty state ── */}
      {visibleInvoices.length === 0 ? (
        <EmptyState isFiltered={filters.length > 0} />
      ) : (
        <ul className="invoice-list__list" aria-label="Invoice list">
          {visibleInvoices.map((invoice, index) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              animationDelay={index * 60}
              onClick={() => onSelectInvoice(invoice.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
