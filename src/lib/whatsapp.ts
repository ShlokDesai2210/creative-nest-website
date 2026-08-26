const WHATSAPP_NUMBER = "918160130771";

export function getWhatsAppUrl(productName?: string, price?: number): string {
  let message: string;

  if (productName && price) {
    message = `Hi! I'm interested in "${productName}" (₹${price}). Is it available?`;
  } else if (productName) {
    message = `Hi! I'm interested in "${productName}". Could you share more details?`;
  } else {
    message = `Hi! I'm visiting Creative Nest by Diya and would like to know more about your products.`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppOrderUrl(
  productName: string,
  price: number,
  quantity: number = 1
): string {
  const message = `Hi! I'd like to order:\n\n📦 ${productName}\n💰 ₹${price} x ${quantity}\n💵 Total: ₹${price * quantity}\n\nPlease confirm availability and share payment details. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCustomOrderUrl(details: string): string {
  const message = `Hi! I'd like to place a custom order:\n\n${details}\n\nPlease share pricing and timeline. Thank you!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
