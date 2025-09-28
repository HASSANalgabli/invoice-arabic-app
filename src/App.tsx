import React, { useState } from "react";
import CustomerManager from "./components/CustomerManager";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

function App() {
  const [page, setPage] = useState<"customers" | "invoice" | "preview">("invoice");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  return (
    <div className="main-app">
      <nav>
        <button onClick={() => setPage("customers")}>إدارة العملاء</button>
        <button onClick={() => setPage("invoice")}>إنشاء فاتورة</button>
        <button onClick={() => setPage("preview")}>معاينة/طباعة الفاتورة</button>
      </nav>
      <div>
        {page === "customers" && <CustomerManager />}
        {page === "invoice" && (
          <InvoiceForm
            onPreview={(invoice) => {
              setSelectedInvoice(invoice);
              setPage("preview");
            }}
          />
        )}
        {page === "preview" && (
          <InvoicePreview invoice={selectedInvoice} />
        )}
      </div>
    </div>
  );
}

export default App;