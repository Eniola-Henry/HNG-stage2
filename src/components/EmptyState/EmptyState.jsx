import emptyIllustration from "../../assets/empty-state.png";
import "./EmptyState.css";

export default function EmptyState({ isFiltered = false }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <img
        src={emptyIllustration}
        alt="No invoices illustration"
        className="empty-state__illustration"
      />
      <div className="empty-state__text">
        <h2 className="empty-state__title">There is nothing here</h2>
        <p className="empty-state__body">
          {isFiltered ? (
            "No invoices match the current filter. Try selecting a different status."
          ) : (
            <>
              Create an invoice by clicking the{" "}
              <strong>New Invoice</strong> button and get started
            </>
          )}
        </p>
      </div>
    </div>
  );
}
