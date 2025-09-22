interface TwilioWhatsAppMessage {
  From: string;
  To: string;
  Body: string;
}

interface TwilioWhatsAppResponse {
  account_sid: string;
  api_version: string;
  body: string;
  date_created: string;
  date_sent: string;
  date_updated: string;
  direction: string;
  error_code: string | null;
  error_message: string | null;
  from: string;
  messaging_service_sid: string | null;
  num_media: string;
  num_segments: string;
  price: string | null;
  price_unit: string | null;
  sid: string;
  status: string;
  subresource_uris: object;
  to: string;
  uri: string;
}

class WhatsAppService {
  private accountSid: string;
  private authToken: string;
  private whatsappNumber: string;
  private baseUrl: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID!;
    this.authToken = process.env.TWILIO_AUTH_TOKEN!;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!;
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;

    if (!this.accountSid || !this.authToken || !this.whatsappNumber) {
      throw new Error("Missing required Twilio WhatsApp API credentials");
    }

    console.log("Twilio WhatsApp Service initialized with:", {
      accountSid: this.accountSid?.substring(0, 10) + "...",
      whatsappNumber: this.whatsappNumber,
      baseUrl: this.baseUrl
    });

    // Verify credentials on startup in development
    if (process.env.NODE_ENV === "development") {
      this.verifyCredentials();
    }
  }

  async verifyCredentials(): Promise<void> {
    try {
      console.log("Verifying Twilio credentials...");
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        },
      });

      if (response.ok) {
        const accountInfo = await response.json();
        console.log("Twilio credentials verified successfully:", {
          accountSid: accountInfo.sid,
          status: accountInfo.status,
          type: accountInfo.type
        });
      } else {
        const errorInfo = await response.json();
        console.error("Twilio credential verification failed:", {
          status: response.status,
          error_code: errorInfo.code,
          error_message: errorInfo.message
        });
      }
    } catch (error) {
      console.error("Failed to verify Twilio credentials:", error);
    }
  }

  async sendOTP(phoneNumber: string, otpCode: string): Promise<boolean> {
    try {
      // Clean phone number format (remove any non-digits except +)
      const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");
      
      console.log(`Sending OTP via Twilio WhatsApp to: ${cleanPhoneNumber}`);
      
      const messageBody = `🔐 Your Kontrib verification code is: ${otpCode}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.\n\n- Kontrib Team`;
      
      // Create form data for Twilio API
      const formData = new URLSearchParams();
      formData.append('From', `whatsapp:${this.whatsappNumber}`);
      formData.append('To', `whatsapp:${cleanPhoneNumber}`);
      formData.append('Body', messageBody);

      // Debug logging
      const authString = `${this.accountSid}:${this.authToken}`;
      const encodedAuth = Buffer.from(authString).toString('base64');
      
      console.log("Twilio API call details:", {
        url: `${this.baseUrl}/Messages.json`,
        accountSidLength: this.accountSid.length,
        authTokenLength: this.authToken.length,
        encodedAuthLength: encodedAuth.length
      });

      const response = await fetch(`${this.baseUrl}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${encodedAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
      });

      const result = await response.json();

      if (!response.ok) {
        const isDevelopment = process.env.NODE_ENV === "development";
        
        // Log different levels of detail based on environment
        if (isDevelopment) {
          console.error("Twilio WhatsApp API Error (Development):", {
            status: response.status,
            statusText: response.statusText,
            error_code: result.code,
            error_message: result.message,
            more_info: result.more_info,
            to: cleanPhoneNumber,
            from: this.whatsappNumber
          });
        } else {
          // Production logging with sensitive data redacted
          console.error("Twilio WhatsApp API Error (Production):", {
            status: response.status,
            error_code: result.code,
            error_message: result.message,
            timestamp: new Date().toISOString(),
            to_masked: cleanPhoneNumber.substring(0, 3) + "***" + cleanPhoneNumber.substring(cleanPhoneNumber.length - 3)
          });
        }
        
        return false;
      }

      const isDevelopment = process.env.NODE_ENV === "development";
      
      // Log success with appropriate detail level
      if (isDevelopment) {
        console.log("Twilio WhatsApp OTP sent successfully (Development):", {
          messageSid: result.sid,
          status: result.status,
          to: phoneNumber,
          from: result.from
        });
      } else {
        console.log("Twilio WhatsApp OTP sent successfully (Production):", {
          messageSid: result.sid,
          status: result.status,
          timestamp: new Date().toISOString(),
          to_masked: cleanPhoneNumber.substring(0, 3) + "***" + cleanPhoneNumber.substring(cleanPhoneNumber.length - 3)
        });
      }
      
      return true;
    } catch (error) {
      console.error("Twilio WhatsApp service error:", error);
      return false;
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");
      
      console.log(`Sending message via Twilio WhatsApp to: ${cleanPhoneNumber}`);
      
      // Create form data for Twilio API
      const formData = new URLSearchParams();
      formData.append('From', `whatsapp:${this.whatsappNumber}`);
      formData.append('To', `whatsapp:${cleanPhoneNumber}`);
      formData.append('Body', message);

      const response = await fetch(`${this.baseUrl}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Twilio WhatsApp API Error:", {
          status: response.status,
          statusText: response.statusText,
          error_code: result.code,
          error_message: result.message,
          more_info: result.more_info
        });
        return false;
      }

      console.log("Twilio WhatsApp message sent successfully:", {
        messageSid: result.sid,
        status: result.status,
        to: phoneNumber,
        from: result.from
      });
      
      return true;
    } catch (error) {
      console.error("Twilio WhatsApp service error:", error);
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