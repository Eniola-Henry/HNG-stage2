import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import InvoiceList from "./components/InvoiceList/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm/InvoiceForm";

export default function App() {
  const [currentPage,  setCurrentPage]  = useState("list");
  const [selectedId,   setSelectedId]   = useState(null);
  const [showNewForm,  setShowNewForm]  = useState(false);

  const goToDetail = (id) => {
    setSelectedId(id);
    setCurrentPage("detail");
  };

  const goToList = () => {
    setSelectedId(null);
    setCurrentPage("list");
  };

  const afterNewInvoiceSaved = (id) => {
    setSelectedId(id);
    setCurrentPage("detail");
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        {currentPage === "list" && (
          <InvoiceList
            onSelectInvoice={goToDetail}
            onNewInvoice={() => setShowNewForm(true)}
          />
        )}

        {currentPage === "detail" && (
          <InvoiceDetail
            invoiceId={selectedId}
            onBack={goToList}
          />
        )}
      </main>

      { }
      {showNewForm && (
        <InvoiceForm
          onClose={() => setShowNewForm(false)}
          onSaved={afterNewInvoiceSaved}
        />
      )}
    </div>
  );
}
