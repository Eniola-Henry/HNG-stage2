import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`status-badge status-badge--${status}`}
      role="status"
      aria-label={`Invoice status: ${label}`}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
