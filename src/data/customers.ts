export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  commercialId: string;
}

export const customersData: Customer[] = [
  {
    id: 1,
    name: "شركة تجريبية",
    address: "الرياض، المملكة العربية السعودية",
    phone: "0500000000",
    email: "test@example.com",
    taxId: "123456789",
    commercialId: "987654321"
  }
];