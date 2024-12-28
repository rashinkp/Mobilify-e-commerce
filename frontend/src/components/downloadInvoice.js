import jsPDF from "jspdf";

export const handleDownloadInvoice = (order) => {
  const doc = new jsPDF();


  const actualPrice = order.price;


  const discount = order.couponApplied?.offerAmount || 0;

  const subTotal = actualPrice * (order?.quantity || 1);

  const finalPrice = subTotal - discount;

  // Add background color
  doc.setFillColor(247, 248, 250);
  doc.rect(0, 0, 210, 297, "F");

  // Header background
  doc.setFillColor(51, 122, 183);
  doc.rect(0, 0, 210, 60, "F");

  // Company Details
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.text("Mobilify", 20, 30);
  doc.setFontSize(10);
  doc.text("123 Tech Street, Digital City", 20, 40);
  doc.text("Phone: (555) 123-4567", 20, 45);
  doc.text("Email: support@mobilify.com", 20, 50);

  // Invoice Header
  doc.setFontSize(20);
  doc.text("INVOICE", 120, 30);
  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${order?.orderNumber}`, 120, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 45);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Customer Details Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 65, 180, 40, 3, 3, "F");
  doc.setFontSize(12);
  doc.setTextColor(51, 122, 183);
  doc.text("Bill To:", 20, 75);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`${order.shippingAddress.label}`, 20, 85);
  doc.text(`${order.shippingAddress.street}`, 20, 90);
  doc.text(
    `${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
    20,
    95
  );
  doc.text(
    `Phone: ${order?.shippingAddress?.phone || "Not available"}`,
    20,
    100
  );

  // Table Header
  const startY = 120;
  doc.setFillColor(51, 122, 183);
  doc.rect(15, startY, 180, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Product", 20, startY + 7);
  doc.text("Quantity", 100, startY + 7);
  doc.text("Price (Rs.)", 130, startY + 7);
  doc.text("Total (Rs.)", 160, startY + 7);

  // Table Content
  doc.setTextColor(0, 0, 0);
  let y = startY + 15;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, startY + 12, 180, 15, 2, 2, "F");
  doc.text(order.name.substring(0, 35), 20, y);
  doc.text(order.quantity.toString(), 100, y);
  doc.text(`${actualPrice}`, 130, y);
  doc.text(`${actualPrice * order.quantity}`, 160, y);
  y += 20;

  // Summary Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(95, y, 100, 50, 3, 3, "F");
  const summaryY = y + 15;
  doc.setTextColor(128, 128, 128);
  doc.text("Subtotal (Rs.):", 100, summaryY);
  doc.text("Discount (Rs.):", 100, summaryY + 10);
  doc.text("Shipping (Rs.):", 100, summaryY + 20);

  doc.setTextColor(0, 0, 0);
  doc.text(`${subTotal}`, 170, summaryY);
  doc.text(`-${discount}`, 170, summaryY + 10);
  doc.text(`${order?.shippingCost || 0}`, 170, summaryY + 20);

  // Total
  doc.setFillColor(51, 122, 183);
  doc.rect(95, summaryY + 25, 100, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Total (Rs.):", 100, summaryY + 35);
  doc.text(`${finalPrice}`, 170, summaryY + 35);

  // Footer
  doc.setTextColor(51, 122, 183);
  doc.setFontSize(10);
  doc.text("Thank you for shopping with Mobilify!", 20, y + 80);
  doc.text("For support, contact us at support@mobilify.com", 20, y + 85);

  doc.save(`Mobilify_Invoice_${order?.orderNumber}.pdf`);
};
