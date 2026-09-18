export const getStyle = () => `
    <style>
      @page { margin: 0; size: 80mm auto; }
      body { 
        font-family: 'Courier New', Courier, monospace; 
        width: 76mm; 
        margin: 0 auto; 
        padding: 2mm; 
        color: #000; 
        font-size: 12px; 
        line-height: 1.4;
        font-weight: 900; /* Extra bold and dark */
      }
      .center { text-align: center; }
      .bold { font-weight: 900; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; font-weight: 900; }
      th { text-align: left; border-bottom: 2px dashed #000; padding-bottom: 5px; }
      td { padding: 4px 0; vertical-align: top; }
      .right { text-align: right; }
      hr { border: none; border-top: 2px dashed #000; margin: 10px 0; }
      .tot-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
      .tot-large { font-size: 16px; font-weight: 900; }
    </style>
  `;

export const printDocument = (html, onDone) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '-1000px';
  iframe.style.bottom = '-1000px';
  iframe.style.width = '300px';
  iframe.style.height = '100px';
  document.body.appendChild(iframe);

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();

  iframe.contentWindow.onload = () => {
    iframe.contentWindow.focus();

    let printed = false;
    const done = () => {
      if (printed) return;
      printed = true;
      setTimeout(() => { document.body.removeChild(iframe); }, 1000);
      if (onDone) onDone();
    };

    // In Chrome/Edge/Firefox, onafterprint is reliable.
    iframe.contentWindow.onafterprint = done;
    iframe.contentWindow.print();

    // Fallback in case onafterprint doesn't fire (e.g. some mobile browsers or very old browsers)
    setTimeout(done, 10000);
  };
};

export const printReceipt = (order, franchise) => {
  const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  const fName = franchise?.franchiseName || order?.franchiseId?.franchiseName || '';
  const fAddr = franchise?.address || order?.franchiseId?.address || '';
  const fContact = franchise?.contact || order?.franchiseId?.contact || '';

  const customerHtml = `
    <html>
      <head>
        <title>Print Receipt</title>
        ${getStyle()}
      </head>
      <body>
        <div class="center">
          <img src="/assets/images/logo-1.png" alt="CHICKOZ" style="max-height: 100px; width: auto; margin-bottom: 10px; filter: grayscale(100%) contrast(1.2); image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
          ${fName ? `<div class="bold" style="font-size:14px; margin-bottom: 2px;">${fName}</div>` : ''}
          ${fAddr ? `<div>${fAddr}</div>` : ''}
          ${fContact ? `<div>Ph: ${fContact}</div>` : ''}
        </div>
        
        <hr />
        
        <div style="line-height: 1.6; text-align: justify; text-align-last: center;">
          <span class="bold">Order No:</span> ${order.orderNumber || "—"} | 
          <span class="bold">Date:</span> ${fmtDate(order.createdAt || Date.now())} | 
          <span class="bold">Customer:</span> ${order.customerName || 'Walk-in'}
          ${order.customerMobile ? ` | <span class="bold">Ph:</span> ${order.customerMobile}` : ''} | 
          <span class="bold">Type:</span> ${order.orderType?.replace(/_/g, ' ') || "—"}
          ${order.tableNo ? ` | <span class="bold">Table:</span> ${order.tableNo.split(' - ')[0]}` : ''}
          ${order.deliveryPartner ? ` | <span class="bold">Partner:</span> ${order.deliveryPartner}` : ''}
          ${order.deliveryOrderId ? ` | <span class="bold">P.Order ID:</span> ${order.deliveryOrderId}` : ''}
        </div>
        
        <hr />
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="right">Qty</th>
              <th class="right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  ${item.menuName}
                  ${item.addons?.length ? `<br><small style="color:#333">+ ${item.addons.map(a => a.addonName).join(', ')}</small>` : ''}
                </td>
                <td class="right">${item.qty}</td>
                <td class="right">${((item.discountedPrice + (item.addonTotal || 0)) * item.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <hr />
        
        <div class="tot-row">
          <span>Subtotal</span>
          <span>${(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div class="tot-row">
          <span>Tax</span>
          <span>${(order.tax || 0).toFixed(2)}</span>
        </div>
        ${order.discount > 0 ? `
        <div class="tot-row">
          <span>Discount</span>
          <span>-${order.discount.toFixed(2)}</span>
        </div>` : ''}
        
        <hr />
        
        <div class="tot-row tot-large">
          <span>Total Amount</span>
          <span>${(order.totalAmount || 0).toFixed(2)}</span>
        </div>
        
        <hr />
        
        <div class="center" style="margin-top: 15px; margin-bottom: 20px;">
          <div class="bold">Thank you for visiting!</div>
          <div style="font-size: 11px;">Please come again</div>
        </div>
      </body>
    </html>
  `;

  const kitchenHtml = `
    <html>
      <head>
        <title>Kitchen Ticket</title>
        ${getStyle()}
      </head>
      <body>
        <div class="center">
          <h2 style="margin: 5px 0;">KITCHEN TICKET</h2>
        </div>
        
        <hr />
        
        <div style="line-height: 1.6; text-align: justify; text-align-last: center;">
          <span class="bold">Order No:</span> ${order.orderNumber || "—"} | 
          <span class="bold">Customer:</span> ${order.customerName || 'Walk-in'}
          ${order.tableNo ? ` | <span class="bold">Table:</span> ${order.tableNo.split(' - ')[0]}` : ''}
          ${order.deliveryPartner ? ` | <span class="bold">Partner:</span> ${order.deliveryPartner}` : ''}
          ${order.deliveryOrderId ? ` | <span class="bold">Order ID:</span> ${order.deliveryOrderId}` : ''}
        </div>
        
        <hr />
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="right">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  <span class="bold" style="font-size:13px;">${item.menuName}</span>
                  ${item.addons?.length ? `<br><small style="color:#333">+ ${item.addons.map(a => a.addonName).join(', ')}</small>` : ''}
                  ${item.notes ? `<br><small class="bold" style="font-size:11px;">Note: ${item.notes}</small>` : ''}
                </td>
                <td class="right bold" style="font-size:14px;">${item.qty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${order.orderNotes ? `
        <hr />
        <div><span class="bold">Order Note:</span> ${order.orderNotes}</div>
        ` : ''}
        
        <hr />
        <div class="center" style="margin-top: 15px; margin-bottom: 20px;">
          <div class="bold">*** END TICKET ***</div>
        </div>
      </body>
    </html>
  `;

  // Print customer receipt first, then kitchen ticket
  printDocument(customerHtml, () => {
    // Add a tiny delay before opening the second print dialog to prevent browser blocking it
    setTimeout(() => {
      printDocument(kitchenHtml);
    }, 500);
  });
};

export const printKitchenTicket = (order) => {
  const kitchenHtml = `
    <html>
      <head>
        <title>Kitchen Ticket</title>
        ${getStyle()}
      </head>
      <body>
        <div class="center">
          <h2 style="margin: 5px 0;">KITCHEN TICKET</h2>
        </div>
        
        <hr />
        
        <div style="line-height: 1.6; text-align: justify; text-align-last: center;">
          <span class="bold">Order No:</span> ${order.orderNumber || "—"} | 
          <span class="bold">Customer:</span> ${order.customerName || 'Walk-in'}
          ${order.tableNo ? ` | <span class="bold">Table:</span> ${order.tableNo.split(' - ')[0]}` : ''}
          ${order.deliveryPartner ? ` | <span class="bold">Partner:</span> ${order.deliveryPartner}` : ''}
          ${order.deliveryOrderId ? ` | <span class="bold">Order ID:</span> ${order.deliveryOrderId}` : ''}
        </div>
        
        <hr />
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="right">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  <span class="bold" style="font-size:13px;">${item.menuName}</span>
                  ${item.addons?.length ? `<br><small style="color:#333">+ ${item.addons.map(a => a.addonName).join(', ')}</small>` : ''}
                  ${item.notes ? `<br><small class="bold" style="font-size:11px;">Note: ${item.notes}</small>` : ''}
                </td>
                <td class="right bold" style="font-size:14px;">${item.qty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${order.orderNotes ? `
        <hr />
        <div><span class="bold">Order Note:</span> ${order.orderNotes}</div>
        ` : ''}
        
        <hr />
        <div class="center" style="margin-top: 15px; margin-bottom: 20px;">
          <div class="bold">*** END TICKET ***</div>
        </div>
      </body>
    </html>
  `;

  printDocument(kitchenHtml);
};
