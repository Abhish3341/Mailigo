const postmark = require('postmark');
const OnboardedUser = require('../models/OnboardedUser');
const Communication = require('../models/Communication');

class PostmarkService {
  constructor() {
    if (!process.env.POSTMARK_API_KEY) {
      throw new Error('POSTMARK_API_KEY environment variable is required');
    }
    
    this.client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    this.defaultSender = process.env.DEFAULT_SENDER_EMAIL || 'no-reply@mailigo.com';
  }

  async sendOnboardingEmail(user) {
    try {
      // Check if user has already been onboarded
      const existingOnboarding = await OnboardedUser.findOne({ email: user.email });
      if (existingOnboarding) {
        console.log(`User ${user.email} has already been onboarded`);
        return { success: true, alreadyOnboarded: true };
      }

      // Send welcome email
      const emailData = {
        From: this.defaultSender,
        To: user.email,
        Subject: 'Welcome to Mailigo!',
        HtmlBody: `
          <h2>Welcome to Mailigo, ${user.firstname}!</h2>
          <p>We're excited to have you on board.</p>
        `,
        MessageStream: 'outbound'
      };

      const response = await this.client.sendEmail(emailData);

      // Record onboarding
      await Promise.all([
        // Save onboarding record
        OnboardedUser.create({ email: user.email }),
        
        // Create communication record
        Communication.create({
          type: 'received',
          subject: emailData.Subject,
          content: 'Welcome to Mailigo! We are excited to have you on board.',
          recipient: user.email,
          sender: this.defaultSender,
          emailType: 'onboarding',
          read: false,
          timestamp: new Date()
        })
      ]);

      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('Onboarding email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendMarketingEmail(user, campaign) {
    try {
      const response = await this.client.sendEmail({
        From: this.defaultSender,
        To: user.email,
        Subject: campaign.subject,
        HtmlBody: campaign.content,
        MessageStream: 'outbound'
      });
      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('Marketing email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEngagementEmail(user, type) {
    const templates = {
      feedback: {
        subject: 'We Value Your Feedback!',
        content: `
          <div>
            <h2>How are we doing?</h2>
            <p>Hi ${user.firstname},</p>
            <p>We'd love to hear about your experience with Mailigo. Could you spare a moment to share your feedback?</p>
          </div>
        `
      }
    };

    try {
      const template = templates[type];
      const response = await this.client.sendEmail({
        From: this.defaultSender,
        To: user.email,
        Subject: template.subject,
        HtmlBody: template.content,
        MessageStream: 'outbound'
      });
      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('Engagement email error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = PostmarkService;