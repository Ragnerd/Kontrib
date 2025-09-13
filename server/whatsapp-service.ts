interface WhatsAppMessage {
  messaging_product: "whatsapp";
  to: string;
  type: "text";
  text: {
    body: string;
  };
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private verifiedNumber: string;
  private baseUrl: string = "https://graph.facebook.com/v18.0";

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.verifiedNumber = process.env.WHATSAPP_VERIFIED_NUMBER!;

    if (!this.accessToken || !this.phoneNumberId || !this.verifiedNumber) {
      throw new Error("Missing required WhatsApp API credentials");
    }
  }

  async sendOTP(phoneNumber: string, otpCode: string): Promise<boolean> {
    try {
      // Clean phone number format (remove any non-digits except +)
      const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");
      
      const message: WhatsAppMessage = {
        messaging_product: "whatsapp",
        to: cleanPhoneNumber,
        type: "text",
        text: {
          body: `🔐 Your Kontrib verification code is: ${otpCode}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.\n\n- Kontrib Team`
        }
      };

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("WhatsApp API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return false;
      }

      const result: WhatsAppResponse = await response.json();
      console.log("WhatsApp OTP sent successfully:", {
        messageId: result.messages?.[0]?.id,
        to: phoneNumber
      });
      
      return true;
    } catch (error) {
      console.error("WhatsApp service error:", error);
      return false;
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");
      
      const whatsappMessage: WhatsAppMessage = {
        messaging_product: "whatsapp",
        to: cleanPhoneNumber,
        type: "text",
        text: {
          body: message
        }
      };

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(whatsappMessage)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("WhatsApp API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return false;
      }

      const result: WhatsAppResponse = await response.json();
      console.log("WhatsApp message sent successfully:", {
        messageId: result.messages?.[0]?.id,
        to: phoneNumber
      });
      
      return true;
    } catch (error) {
      console.error("WhatsApp service error:", error);
      return false;
    }
  }

  // Validate phone number format for WhatsApp
  isValidWhatsAppNumber(phoneNumber: string): boolean {
    // WhatsApp requires numbers in international format
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
    return /^\+[1-9]\d{1,14}$/.test(cleanNumber);
  }
}

export const whatsappService = new WhatsAppService();