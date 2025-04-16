const postmark = require('postmark');

class PostmarkService {
    constructor(apiKey) {
        if (!apiKey) {
          console.warn('Warning: No Postmark API key provided. Email sending will be disabled.');
          this.client = null;
        } else {
          this.client = new postmark.ServerClient(apiKey);
        }
      }

      async sendEmail(options) {
        if (!this.client) {
          console.log('Email would have been sent:', options);
          return { success: true, messageId: 'mock-id-' + Date.now() };
        }
        
        try {
          const response = await this.client.sendEmail({
            From: options.from,
            To: options.to,
            Subject: options.subject,
            HtmlBody: options.htmlContent,
            TextBody: options.textContent,
            MessageStream: options.messageStream || "outbound",
            TrackOpens: true,
            TrackLinks: "HtmlAndText"
          });
          
          return { success: true, messageId: response.MessageID };
        } catch (error) {
          console.error('Postmark email sending error:', error);
          return { success: false, error: error.message };
        }
      }

  async getEmailAnalytics(messageId) {
    try {
      const opens = await this.client.getMessageOpens({ messageId });
      const clicks = await this.client.getClicksForMessage({ messageId });
      
      return { opens, clicks };
    } catch (error) {
      console.error('Postmark analytics error:', error);
      return { error: error.message };
    }
  }
}

module.exports = PostmarkService;