import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// مسارات الصور
const logo = process.env.PUBLIC_URL + "/images/logo.png";
const cert1 = process.env.PUBLIC_URL + "/images/cert1.png";
const cert2 = process.env.PUBLIC_URL + "/images/cert2.png";
const cert3 = process.env.PUBLIC_URL + "/images/cert3.png";

const InvoicePreview: React.FC<{ invoice: any }> = ({ invoice }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // حفظ كملف PDF (كل صفحة)
  const handleDownloadPDF = async () => {
    const pages = Array.from(document.querySelectorAll(".page"));

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i] as HTMLElement, {
        scale: 2,
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
  };

  if (!invoice) return <div>يرجى إنشاء الفاتورة أولاً</div>;

  return (
    <div>
      <div className="no-print" style={{ marginBottom: 16 }}>
        <button onClick={handlePrint}>طباعة الفاتورة والشهادات</button>
        <button onClick={handleDownloadPDF}>تحميل الفاتورة PDF</button>
      </div>
      <div ref={printRef}>
        {/* الصفحة الأولى: الفاتورة */}
        <div className="page invoice-preview">
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={logo} alt="شعار المؤسسة" style={{ height: 80 }} />
            <div>
              <h2 style={{ color: "#234e85", margin: 0 }}>فاتورة ضريبية</h2>
              <div>رقم الفاتورة: {invoice.invoiceNumber}</div>
              <div>تاريخ الإصدار: {invoice.date}</div>
            </div>
          </header>
          <hr />
          <section>
            <h3>بيانات العميل</h3>
            <div>الاسم: {invoice.customer?.name}</div>
            <div>العنوان: {invoice.customer?.address}</div>
            <div>الهاتف: {invoice.customer?.phone}</div>
            <div>البريد الإلكتروني: {invoice.customer?.email}</div>
            <div>رقم الضريبة: {invoice.customer?.taxId}</div>
            <div>السجل التجاري: {invoice.customer?.commercialId}</div>
          </section>
          <section>
            <h3>المنتجات / الخدمات</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>الإجمالي الفرعي</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice}</td>
                    <td>{item.quantity * item.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section>
            <div>الإجمالي قبل الضريبة: <strong>{invoice.subTotal.toFixed(2)}</strong> ريال</div>
            <div>
              الخصم: {invoice.discountType === "percent" ? `${invoice.discountValue}%` : `${invoice.discountValue} ريال`}  
              <span> ({invoice.discount.toFixed(2)} ريال)</span>
            </div>
            <div>نسبة الضريبة (VAT): {invoice.vatRate}% ({invoice.vat.toFixed(2)} ريال)</div>
            <div>الإجمالي النهائي: <strong>{invoice.total.toFixed(2)}</strong> ريال</div>
          </section>
          <section>
            <h3>خيارات الدفع</h3>
            <div>طريقة الدفع: {invoice.paymentMethod === "bank" ? "تحويل بنكي" : invoice.paymentMethod === "cash" ? "نقداً" : invoice.paymentMethod === "cheque" ? "شيك" : "بطاقة ائتمان"}</div>
            {invoice.paymentMethod === "bank" && (
              <>
                <div>اسم البنك: {invoice.bankName}</div>
                <div>رقم الحساب البنكي / IBAN: {invoice.bankAccount}</div>
              </>
            )}
          </section>
          <footer style={{ marginTop: 48, fontSize: 14, textAlign: "center" }}>
            مؤسسة شبكة التميز للمقاولات - مقاولات عامة للمباني<br />
            س ت 1010733588 - جوال: 0503241933 - رقم العضوية: 220582 - ص ب: 330418 الرياض 12433
          </footer>
        </div>

        {/* الصفحة الثانية: شهادة التصنيف */}
        <div className="page cert-page">
          <img src={cert1} alt="شهادة تصنيف مقدمي خدمات المدن" style={{ width: "100%", maxWidth: 900, display: "block", margin: "0 auto" }} />
        </div>
        {/* الصفحة الثالثة: شهادة ISO 45001 */}
        <div className="page cert-page">
          <img src={cert2} alt="شهادة ISO 45001" style={{ width: "100%", maxWidth: 900, display: "block", margin: "0 auto" }} />
        </div>
        {/* الصفحة الرابعة: شهادة ISO 9001 */}
        <div className="page cert-page">
          <img src={cert3} alt="شهادة ISO 9001" style={{ width: "100%", maxWidth: 900, display: "block", margin: "0 auto" }} />
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;