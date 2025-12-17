import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import type { Order } from "@/apis/orderApi"

const formatCurrency = (v: number | undefined | null) =>
  (v || 0)?.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ"

// Invoice template as a React component for better maintainability & styling
function InvoiceDocument({ order }: { order: Order }) {
  const items = order.orderItems || []
  const subTotal = items.reduce((s, i) => s + (i.quantity * i.price), 0)
  const discount = order.discountAmount || 0
  const total = order.totalAmount || 0
  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleString("vi-VN")
    : ""

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{`Hoá đơn #${order.orderId}`}</title>
        <style>{`
          :root {
            color-scheme: light;
            --brand: #10b981;
            --brand-2: #0ea5e9;
            --text: #0f172a;
            --muted: #64748b;
            --border: #e2e8f0;
            --bg: #f8fafc;
          }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: 'Inter', Roboto, Arial, sans-serif; color: var(--text); background: var(--bg); }
          .page { max-width: 900px; margin: 24px auto; background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 50px rgba(15,23,42,0.08); }
          .header { padding: 24px 28px; background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(14,165,233,0.12)); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 16px; }
          .brand { font-size: 22px; font-weight: 800; color: var(--brand); letter-spacing: 0.4px; }
          .muted { color: var(--muted); font-size: 13px; }
          h1 { margin: 0 0 6px 0; font-size: 24px; }
          .section { padding: 22px 28px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
          .card { border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; background: #fff; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid var(--border); font-size: 14px; }
          th { background: #f8fafc; text-align: left; color: #0f172a; font-weight: 600; }
          td:last-child, th:last-child { text-align: right; }
          .qty { text-align: center; }
          .totals { width: 320px; margin-left: auto; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
          .totals-row { display: flex; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 14px; }
          .totals-row:last-child { border-bottom: none; background: #f0fdf4; font-weight: 700; color: #0f172a; }
          .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: rgba(16,185,129,0.12); color: #0f172a; font-size: 13px; }
          .print-btn { padding: 10px 14px; background: var(--brand); color: #fff; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 10px 30px rgba(16,185,129,0.35); }
          .footer { padding: 0 28px 24px; display: flex; justify-content: space-between; align-items: center; }
          .signature { height: 60px; border-bottom: 1px dashed var(--border); width: 200px; }
          @media print { .no-print { display: none; } .page { box-shadow: none; border: none; margin: 0; } body { background: #fff; } }
        `}</style>
      </head>
      <body>
        <div className="page">
          <div className="header">
            <div>
              <div className="brand">Bách Hoá Xanh</div>
              <div className="muted">Hoá đơn bán hàng • #{order.orderId}</div>
              <div className="muted">Ngày: {orderDate}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "#0f172a" }}>Liên hệ</div>
              <div className="muted">Địa chỉ: TP. Hồ Chí Minh</div>
              <div className="muted">SĐT: 0987 654 321</div>
            </div>
          </div>

          <div className="section grid">
            <div className="card">
              <div className="muted" style={{ marginBottom: 4 }}>Khách hàng</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{order.customerName || "Khách lẻ"}</div>
              <div className="muted">Mã KH: {order.customerId || "-"}</div>
            </div>
            <div className="card">
              <div className="muted" style={{ marginBottom: 4 }}>Nhân viên bán</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{order.userName || "-"}</div>
              <div className="badge">
                <span>Trạng thái:</span>
                <strong>{order.status || "paid"}</strong>
              </div>
            </div>
          </div>

          <div className="section">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "46%" }}>Sản phẩm</th>
                  <th className="qty" style={{ width: "12%" }}>SL</th>
                  <th style={{ width: "20%", textAlign: "right" }}>Đơn giá</th>
                  <th style={{ width: "22%", textAlign: "right" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const name = it.product?.productName || `Sản phẩm #${it.productId}`
                  const lineTotal = it.quantity * it.price
                  return (
                    <tr key={idx}>
                      <td>{name}</td>
                      <td className="qty">{it.quantity}</td>
                      <td>{formatCurrency(it.price)}</td>
                      <td>{formatCurrency(lineTotal)}</td>
                    </tr>
                  )
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#94a3b8" }}>
                      Không có sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="section" style={{ paddingTop: 4 }}>
            <div className="totals">
              <div className="totals-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              <div className="totals-row">
                <span>Giảm giá</span>
                <span>{formatCurrency(discount)}</span>
              </div>
              <div className="totals-row">
                <span>Tổng thanh toán</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 10 }}>
            <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="muted">Hình thức thanh toán</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {order.status === "paid" ? "Đã thanh toán" : order.status || "Chờ thanh toán"}
                </div>
              </div>
              <div className="badge" style={{ background: "rgba(16,185,129,0.15)" }}>
                Đã thanh toán
              </div>
            </div>
          </div>

          <div className="footer">
            <div>
              <div className="muted">Ký nhận</div>
              <div className="signature"></div>
            </div>
            <div className="no-print">
              <button className="print-btn" id="print-btn">
                In hoá đơn
              </button>
            </div>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const btn = document.getElementById('print-btn');
                  if (btn) {
                    btn.addEventListener('click', () => window.print());
                  }
                })();
              `,
            }}
          />
        </div>
      </body>
    </html>
  )
}

/**
 * Convert the invoice React component to static HTML for printing / new window
 */
export function buildInvoiceHtml(order: Order) {
  const html = "<!doctype html>" + renderToStaticMarkup(<InvoiceDocument order={order} />)
  return html
}

export default buildInvoiceHtml
