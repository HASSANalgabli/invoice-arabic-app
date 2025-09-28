import React, { useState } from "react";
import { customersData, Customer } from "../data/customers";

type InvoiceItem = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
};

type PaymentMethod = "bank" | "cash" | "cheque" | "card";

const initialItem: InvoiceItem = {
  id: Date.now(),
  name: "",
  quantity: 1,
  unitPrice: 0,
  subTotal: 0,
};

const InvoiceForm: React.FC<{ onPreview: (invoice: any) => void }> = ({ onPreview }) => {
  const [customerId, setCustomerId] = useState<number>(customersData[0]?.id || 0);
  const [items, setItems] = useState<InvoiceItem[]>([{ ...initialItem }]);
  const [vatRate, setVatRate] = useState<number>(15);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("fixed");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [bankName, setBankName] = useState<string>(""
  );
  const [bankAccount, setBankAccount] = useState<string>("");

  // حسابات الفاتورة
  const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount =
    discountType === "percent"
      ? (subTotal * discountValue) / 100
      : discountValue;
  const vat = ((subTotal - discount) * vatRate) / 100;
  const total = subTotal - discount + vat;

  // وظائف إدارة المنتجات
  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { ...initialItem, id: Date.now() }]);
  };

  const removeItem = (id: number) => {
    setItems(items.length === 1 ? items : items.filter(item => item.id !== id));
  };

  // حفظ كملف PDF أو معاينة
  const handlePreview = () => {
    const customer = customersData.find(c => c.id === customerId);
    onPreview({
      invoiceNumber: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      customer,
      items,
      subTotal,
      discountType,
      discountValue,
      discount,
      vatRate,
      vat,
      total,
      paymentMethod,
      bankName,
      bankAccount,
    });
  };

  return (
    <div className="invoice-form">
      <h2>إنشاء فاتورة جديدة</h2>
      {/* اختيار العميل */}
      <div>
        <label>اختر العميل:</label>
        <select value={customerId} onChange={e => setCustomerId(Number(e.target.value))}>
          {customersData.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {/* جدول المنتجات */}
      <h3>بنود الفاتورة</h3>
      <table>
        <thead>
          <tr>
            <th>اسم المنتج/الخدمة</th>
            <th>الكمية</th>
            <th>سعر الوحدة</th>
            <th>الإجمالي الفرعي</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => updateItem(item.id, "name", e.target.value)}
                  placeholder="اسم المنتج أو الخدمة"
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateItem(item.id, "quantity", Number(e.target.value))}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={item.unitPrice}
                  onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value))}
                  required
                />
              </td>
              <td>{item.quantity * item.unitPrice}</td>
              <td>
                <button type="button" onClick={() => removeItem(item.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem}>إضافة بند</button>
      {/* الحسابات */}
      <div className="calculations">
        <div>الإجمالي قبل الضريبة: <strong>{subTotal.toFixed(2)}</strong> ريال</div>
        <div>
          الخصم:
          <select value={discountType} onChange={e => setDiscountType(e.target.value as any)}>
            <option value="fixed">مبلغ ثابت</option>
            <option value="percent">نسبة مئوية</option>
          </select>
          <input
            type="number"
            min={0}
            value={discountValue}
            onChange={e => setDiscountValue(Number(e.target.value))}
          />
          <span>({discount.toFixed(2)} ريال)</span>
        </div>
        <div>
          نسبة الضريبة المضافة (VAT):
          <input
            type="number"
            min={0}
            value={vatRate}
            onChange={e => setVatRate(Number(e.target.value))}
          /> %
          <span>({vat.toFixed(2)} ريال)</span>
        </div>
        <div>
          الإجمالي الكلي بعد الضريبة: <strong>{total.toFixed(2)}</strong> ريال
        </div>
      </div>
      {/* خيارات الدفع */}
      <div className="payment">
        <h3>خيارات الدفع</h3>
        <label>طريقة الدفع:</label>
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
          <option value="bank">تحويل بنكي</option>
          <option value="cash">نقداً</option>
          <option value="cheque">شيك</option>
          <option value="card">بطاقة ائتمان</option>
        </select>
        {paymentMethod === "bank" && (
          <>
            <input
              type="text"
              placeholder="اسم البنك"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
            />
            <input
              type="text"
              placeholder="رقم الحساب/IBAN"
              value={bankAccount}
              onChange={e => setBankAccount(e.target.value)}
            />
          </>
        )}
      </div>
      {/* معاينة الفاتورة */}
      <button type="button" onClick={handlePreview}>معاينة وطباعة الفاتورة</button>
    </div>
  );
};

export default InvoiceForm;