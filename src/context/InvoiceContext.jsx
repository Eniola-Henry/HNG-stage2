import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SAMPLE_INVOICES } from "../data/sampleInvoices";
import {
  generateInvoiceId,
  addDaysToDate,
  calcInvoiceTotal,
  hydrateItems,
} from "../utils/invoiceHelpers";

const InvoiceContext = createContext(null);

const STORAGE_KEY = "invoice-app-data";

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SAMPLE_INVOICES;
    } catch {
      return SAMPLE_INVOICES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  /** Create a new invoice */
  const createInvoice = useCallback((formData, status = "pending") => {
    const id = generateInvoiceId();
    const newInvoice = {
      ...formData,
      id,
      status,
      paymentDue: addDaysToDate(formData.createdAt, formData.paymentTerms),
      total: calcInvoiceTotal(formData.items),
      items: hydrateItems(formData.items),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return id;
  }, []);

  /** Update an existing invoice */
  const updateInvoice = useCallback((id, formData) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id !== id
          ? inv
          : {
              ...inv,
              ...formData,
              paymentDue: addDaysToDate(formData.createdAt, formData.paymentTerms),
              total: calcInvoiceTotal(formData.items),
              items: hydrateItems(formData.items),
            }
      )
    );
  }, []);

  /** Delete an invoice by ID */
  const deleteInvoice = useCallback((id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  /** Mark a pending invoice as paid */
  const markInvoiceAsPaid = useCallback((id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );
  }, []);

  return (
    <InvoiceContext.Provider
      value={{ invoices, createInvoice, updateInvoice, deleteInvoice, markInvoiceAsPaid }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used inside InvoiceProvider");
  return ctx;
};
