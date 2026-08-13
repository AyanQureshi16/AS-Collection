// WhatsApp order message generator for AS Collection
// Redirects to wa.me with a pre-filled order message

const formatPrice = (amount) => `PKR ${Number(amount || 0).toLocaleString("en-PK")}`;

export const generateWhatsAppOrder = (
  cartItems,
  customerInfo,
  shippingCharge = 0,
  whatsAppNumber = ""
) => {
  const cleanedNumber = String(whatsAppNumber || "").replace(/\D/g, "");

  if (!cleanedNumber) {
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const grandTotal = subtotal + Number(shippingCharge || 0);

  const itemLines = cartItems
    .map((item, index) => {
      const sizeText = item.selectedSize ? `\n   Size: ${item.selectedSize}` : "";
      return (
        `${index + 1}. *${item.name}*` +
        `${sizeText}\n` +
        `   Qty: ${item.quantity}\n` +
        `   Price: ${formatPrice(item.price)} each\n` +
        `   Subtotal: ${formatPrice((Number(item.price || 0) * Number(item.quantity || 0)))}`
      );
    })
    .join("\n\n");

  const message =
    `Assalam-o-Alaikum,\n\n` +
    `I would like to place an order from *AS Collection*.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🛍️ *ORDER DETAILS*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `${itemLines}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *PRICE SUMMARY*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Subtotal: ${formatPrice(subtotal)}\n` +
    `Shipping: ${formatPrice(shippingCharge)}\n` +
    `*Grand Total: ${formatPrice(grandTotal)}*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *DELIVERY DETAILS*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Name: ${customerInfo.name}\n` +
    `Phone: ${customerInfo.phone}\n` +
    `City: ${customerInfo.city}\n` +
    `Address: ${customerInfo.address}` +
    (customerInfo.instructions ? `\nSpecial Instructions: ${customerInfo.instructions}` : "") +
    `\n\nThank you! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;
};
