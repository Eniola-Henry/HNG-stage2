import { useState } from "react";
import { useInvoices } from "../../context/InvoiceContext";
import StatusBadge from "../StatusBadge/StatusBadge";
import DeleteModal from "../DeleteModal/DeleteModal";
import InvoiceForm from "../InvoiceForm/InvoiceForm";
import { formatDate, formatCurrency } from "../../utils/formatters";
import "./InvoiceDetail.css";

const ArrowLeftIcon = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
    <path d="M6 1L2 5l6 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function InvoiceDetail({ invoiceId, onBack }) {
  const { invoices, deleteInvoice, markInvoiceAsPaid } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm,    setShowEditForm]    = useState(false);

  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return (
      <div className="page-inner">
        <button className="invoice-detail__back-btn" onClick={onBack}>
          <ArrowLeftIcon /> Go Back
        </button>
        <p style={{ color: "var(--txt-muted)" }}>Invoice not found.</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoiceId);
    onBack();
  };

  const handleMarkPaid = () => markInvoiceAsPaid(invoiceId);

  return (
    <>
      <div className="page-inner invoice-detail" style={{ paddingBottom: 120 }}>

        {/* ── Back button ── */}
        <button className="invoice-detail__back-btn" onClick={onBack} aria-label="Go back to invoices">
          <ArrowLeftIcon /> Go Back
        </button>

        {/* ── Status bar ── */}
        <div className="invoice-detail__status-bar">
          <div className="invoice-detail__status-left">
            <span className="invoice-detail__status-label">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Desktop action buttons */}
          <div className="invoice-detail__actions invoice-detail__actions--desktop">
            <button className="btn btn-edit" onClick={() => setShowEditForm(true)}>Edit</button>
            <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
            {invoice.status === "pending" && (
              <button className="btn btn-primary" onClick={handleMarkPaid}>
                Mark as Paid
              </button>
            )}
          </div>
        </div>

        {/* ── Main invoice card ── */}
        <div className="invoice-detail__card">

          {/* Row 1: ID / description  +  sender address */}
          <div className="invoice-detail__row1">
            <div>
              <p className="invoice-detail__inv-id">
                <span className="invoice-detail__inv-id-hash">#</span>
                {invoice.id}
              </p>
              <p className="invoice-detail__inv-desc">{invoice.description}</p>
            </div>
            <address className="invoice-detail__from-address">
              {invoice.senderAddress.street}<br />
              {invoice.senderAddress.city}<br />
              {invoice.senderAddress.postCode}<br />
              {invoice.senderAddress.country}
            </address>
          </div>

          {/* Row 2: Dates | Bill To | Sent To */}
          <div className="invoice-detail__row2">
            <div>
              <p className="invoice-detail__meta-label">Invoice Date</p>
              <p className="invoice-detail__meta-val">{formatDate(invoice.createdAt)}</p>
              <p className="invoice-detail__meta-label" style={{ marginTop: 32 }}>Payment Due</p>
              <p className="invoice-detail__meta-val">{formatDate(invoice.paymentDue)}</p>
            </div>

            <div>
              <p className="invoice-detail__meta-label">Bill To</p>
              <p className="invoice-detail__meta-val">{invoice.clientName}</p>
              <address className="invoice-detail__client-address">
                {invoice.clientAddress.street}<br />
                {invoice.clientAddress.city}<br />
                {invoice.clientAddress.postCode}<br />
                {invoice.clientAddress.country}
              </address>
            </div>

            <div>
              <p className="invoice-detail__meta-label">Sent To</p>
              <p className="invoice-detail__meta-val invoice-detail__meta-val--email">
                {invoice.clientEmail}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="invoice-detail__items-table" role="table" aria-label="Invoice line items">
            {/* Header */}
            <div className="invoice-detail__items-head" role="row">
              <span role="columnheader">Item Name</span>
              <span role="columnheader">QTY.</span>
              <span role="columnheader">Price</span>
              <span role="columnheader">Total</span>
            </div>

            {/* Rows */}
            {invoice.items.map((item, i) => (
              <div key={i} className="invoice-detail__item-row" role="row">
                <span className="invoice-detail__item-name"  role="cell">{item.name}</span>
                <span className="invoice-detail__item-qty"   role="cell">{item.quantity}</span>
                <span className="invoice-detail__item-price" role="cell">{formatCurrency(item.price)}</span>
                <span className="invoice-detail__item-total" role="cell">{formatCurrency(item.total)}</span>
              </div>
            ))}

            {/* Total footer */}
            <div className="invoice-detail__items-footer">
              <span className="invoice-detail__amount-label">Amount Due</span>
              <span className="invoice-detail__amount-total">{formatCurrency(invoice.total)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile bottom action bar ── */}
      <div className="invoice-detail__actions invoice-detail__actions--mobile" role="toolbar" aria-label="Invoice actions">
        <button className="btn btn-edit" onClick={() => setShowEditForm(true)}>Edit</button>
        <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
        {invoice.status === "pending" && (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleMarkPaid}>
            Mark as Paid
          </button>
        )}
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showEditForm && (
        <InvoiceForm
          existingInvoice={invoice}
          onClose={() => setShowEditForm(false)}
          onSaved={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}
