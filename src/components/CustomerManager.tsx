import React, { useState } from "react";
import { customersData, Customer } from "../data/customers";

const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: Date.now(),
    name: "",
    address: "",
    phone: "",
    email: "",
    taxId: "",
    commercialId: ""
  });

  const addCustomer = () => {
    if (!newCustomer.name) return;
    setCustomers([...customers, { ...newCustomer, id: Date.now() }]);
    setNewCustomer({
      id: Date.now(),
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
      commercialId: ""
    });
  };

  const removeCustomer = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  return (
    <div className="customer-manager">
      <h2>إدارة العملاء</h2>
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>العنوان</th>
            <th>الهاتف</th>
            <th>البريد الإلكتروني</th>
            <th>الضريبة/السجل التجاري</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.address}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.taxId} / {c.commercialId}</td>
              <td>
                <button onClick={() => removeCustomer(c.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>إضافة عميل جديد</h3>
      <div className="customer-form">
        <input
          type="text"
          placeholder="الاسم"
          value={newCustomer.name}
          onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="العنوان"
          value={newCustomer.address}
          onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="الهاتف"
          value={newCustomer.phone}
          onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={newCustomer.email}
          onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="رقم الضريبة"
          value={newCustomer.taxId}
          onChange={e => setNewCustomer({ ...newCustomer, taxId: e.target.value })}
        />
        <input
          type="text"
          placeholder="السجل التجاري"
          value={newCustomer.commercialId}
          onChange={e => setNewCustomer({ ...newCustomer, commercialId: e.target.value })}
        />
        <button onClick={addCustomer}>إضافة</button>
      </div>
    </div>
  );
};

export default CustomerManager;