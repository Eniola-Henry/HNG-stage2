import StatusBadge from "../StatusBadge/StatusBadge";
import { formatDate, formatCurrency } from "../../utils/formatters";
import "./InvoiceCard.css";

const ArrowRightIcon = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
    <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function InvoiceCard({ invoice, onClick, animationDelay = 0 }) {
  const { id, paymentDue, clientName, total, status } = invoice;

  return (
    <li className="invoice-card-wrapper" style={{ animationDelay: `${animationDelay}ms` }}>
      <button
        className="invoice-card"
        onClick={onClick}
        aria-label={`Invoice #${id} for ${clientName}, ${formatCurrency(total)}, status: ${status}`}
      >
        {/* Invoice ID */}
        <span className="invoice-card__id">
          <span className="invoice-card__id-hash">#</span>{id}
        </span>

        {/* Due date */}
        <span className="invoice-card__due">
          Due {formatDate(paymentDue)}
        </span>

        {/* Client name */}
        <span className="invoice-card__client">{clientName}</span>

        {/* Amount */}
        <span className="invoice-card__amount">{formatCurrency(total)}</span>

        {/* Status badge */}
        <span className="invoice-card__badge">
          <StatusBadge status={status} />
        </span>

        {/* Arrow (desktop) */}
        <span className="invoice-card__arrow">
          <ArrowRightIcon />
        </span>
      </button>
    </li>
  );
}
