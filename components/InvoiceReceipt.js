import { Typography } from "antd";
const { Text } = Typography;

// InvoiceReceipt.jsx
export const InvoiceReceipt = ({ data }) => {
  const transaction = data?.transaction;
  const totalQty =
    transaction?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice =
    transaction?.items.reduce((acc, item) => acc + item.totalPrice, 0) || 0;
  const ppn = totalPrice * 0.1;
  const grandTotal = totalPrice + ppn;

  return (
    <div
      id="invoice-receipt"
      style={{
        fontFamily: "monospace",
        background: "#fff",
        padding: "20px",
        width: "300px",
        border: "1px solid #000",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <strong>APOTEK SEHAT BERSAMA 2</strong>
        <br />
        Jl. Raya Pondok Kelapa Blok J13 No. 38
        <br />
        Telp: 081289220357
      </div>

      <div>
        <strong>Tanggal:</strong> {new Date(data?.createdAt).toLocaleString()}
        <br />
        <strong>Pelanggan:</strong> {transaction?.custName}
        <br />
        <strong>Telepon:</strong> {transaction?.phone || "-"}
        <br />
      </div>

      <hr />

      <div>
        {transaction?.items.map((item, index) => (
          <div key={index}>
            {item.product.name}
            <br />
            {item.quantity} x {item.unitPrice.toLocaleString()} ={" "}
            {item.totalPrice.toLocaleString()}
            <br />
          </div>
        ))}
      </div>

      <hr />

      <div>
        <Text>Total Quantity: {totalQty.toLocaleString()}</Text>
        Subtotal: {totalPrice.toLocaleString()}
        <br />
        PPN 10%: {ppn.toLocaleString()}
        <br />
        <strong>Total: {grandTotal.toLocaleString()}</strong>
      </div>

      <hr />

      <div style={{ fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
        Barang yang sudah dibeli tidak dapat dikembalikan
        <br />
        WhatsApp: 081289220357
      </div>
    </div>
  );
};
