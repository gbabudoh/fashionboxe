/**
 * Mattermost Notification Service
 * Sends real-time alerts to brand-specific channels via Incoming Webhooks.
 */

interface BrandAlertData {
  type: 'TRY_ON' | 'PURCHASE' | 'VIP_REQUEST';
  productName?: string;
  customerName?: string;
  price?: number | string;
  roomId?: string;
}

export async function sendBrandAlert(brandWebhookUrl: string, data: BrandAlertData) {
  let text = '';
  
  if (data.type === 'PURCHASE') {
    text = `### 💰 NEW SALE!\n**${data.productName}** sold for **$${data.price}**! Check your dashboard for shipping details.`;
  } else if (data.type === 'TRY_ON') {
    text = `### 🤳 Interaction Alert\nSomeone just used the **Virtual Try-On** for **${data.productName}**. Mention it on stream to close the sale!`;
  } else if (data.type === 'VIP_REQUEST') {
    text = `### 💎 VIP SHOPPER REQUEST\nA customer is requesting a **1-to-1 Personal Shopper** session!\n**Room ID:** ${data.roomId}\n[Join Private Session](https://meet.jit.si/${data.roomId})`;
  }

  const payload = {
    username: "Fashionboxe Bot",
    icon_url: "https://fashionboxe.com/logo.png",
    text,
  };

  try {
    const response = await fetch(brandWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[MATTERMOST] Failed to send alert: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[MATTERMOST] Network error sending alert:', error);
  }
}
