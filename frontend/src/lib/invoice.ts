import type { Order } from "@/apis/orderApi";

const formatCurrency = (v: number) =>
  v?.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";

export function buildInvoiceHtml(order: Order) {
  const rows = (order.orderItems || [])
    .map(
      (it) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${it.productName}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center">${it.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.price.toLocaleString("vi-VN")}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.subtotal.toLocaleString("vi-VN")}</td>
      </tr>`
    )
    .join("\n");

  const orderDate = new Date(order.orderDate).toLocaleString("vi-VN");

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Hoá đơn #${order.orderId}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { font-family: Inter, Roboto, Arial, sans-serif; color:#111 }
      .container { max-width:800px; margin:20px auto; padding:20px }
      h1 { margin:0 0 8px 0 }
      table { width:100%; border-collapse:collapse; margin-top:12px }
      th, td { padding:8px; border:1px solid #ddd }
      th { background:#f7f7f7; text-align:left }
      .right { text-align:right }
      .muted { color:#666; font-size:0.9rem }
      @media print { .no-print { display:none } }
    </style>
  </head>
  <body>
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1>Hoá đơn bán hàng</h1>
          <div class="muted">Hóa đơn #: ${order.orderId}</div>
          <div class="muted">Ngày: ${orderDate}</div>
        </div>
        <div style="text-align:right">
          <div><strong>Bách Hoá Xanh</strong></div>
          <div class="muted">Địa chỉ: TPHCM</div>
          <div class="muted">SĐT: 0987654321</div>
        </div>
      </div>

      <hr style="margin:16px 0" />

      <div style="display:flex;justify-content:space-between;gap:12px">
        <div>
          <div><strong>Khách hàng</strong></div>
          <div>${order.customerName || "Khách lẻ"}</div>
          <div class="muted">SĐT: ${order.customerId || "-"}</div>
        </div>
        <div style="text-align:right">
          <div><strong>Người bán</strong></div>
          <div>${order.userName || "-"}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th style="text-align:center">SL</th>
            <th style="text-align:right">Đơn giá</th>
            <th style="text-align:right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="display:flex;justify-content:flex-end;margin-top:12px">
        <table style="width:360px;border-collapse:collapse">
          <tr>
            <td style="padding:8px;border:1px solid #ddd">Tạm tính</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${formatCurrency(
              (order.orderItems || []).reduce((s, i) => s + i.subtotal, 0)
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd">Giảm giá</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${formatCurrency(
              order.discountAmount || 0
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd"><strong>Tổng</strong></td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right"><strong>${formatCurrency(
              order.totalAmount || 0
            )}</strong></td>
          </tr>
        </table>
      </div>

      <div style="margin-top:20px" class="muted">
        <div>Thanh toán:</div>
        ${(order.orderItems && order.orderItems.length > 0) ? '' : ''}
        <div>${(order.totalAmount ? 'Đã thanh toán' : '')}</div>
      </div>

      <div style="margin-top:28px;display:flex;justify-content:space-between">
        <div>
          <div class="muted">Ký nhận</div>
          <div style="height:60px"></div>
        </div>
        <div style="text-align:right" class="no-print">
          <button onclick="window.print()" style="padding:8px 12px;background:#10b981;color:#fff;border:none;border-radius:6px">In hoá đơn</button>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  return html;
}

export default buildInvoiceHtml;
