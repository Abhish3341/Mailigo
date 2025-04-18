const postmark = require('postmark');
const OnboardedUser = require('../models/OnboardedUser');

class PostmarkService {
  constructor() {
    this.client = new postmark.ServerClient('ffba1aab-3b38-49c1-9364-3dbb7a69923a');
    this.defaultSender = 'abhinav.sharma@learner.manipal.edu';
    this.supportEmail = 'support@mailigo.xyz';
    this.dashboardUrl = 'https://mailigo.xyz/dashboard';
  }

  async sendOnboardingEmail(user) {
    try {
      // Check if user has already been onboarded
      const existingOnboarding = await OnboardedUser.findOne({ email: user.email });
      if (existingOnboarding) {
        console.log(`User ${user.email} has already been onboarded`);
        return { success: true, alreadyOnboarded: true };
      }

      const response = await this.client.sendEmailWithTemplate({
        From: this.defaultSender,
        To: user.email,
        TemplateAlias: 'onboarding',
        TemplateModel: {
          'user-name': user.firstname,
          dashboard_link: this.dashboardUrl,
          support_email: this.supportEmail
        },
        MessageStream: 'onboarding'
      });

      // Record the onboarding email
      await OnboardedUser.create({
        email: user.email
      });

      // Create a communication record for the onboarding email
      await Communication.create({
        type: 'received',
        subject: 'Welcome to Mailigo!',
        content: 'Welcome to Mailigo! We are excited to have you on board.',
        recipient: user.email,
        sender: this.defaultSender,
        emailType: 'onboarding',
        read: false,
        timestamp: new Date()
      });

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
        MessageStream: 'marketings'
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>How are we doing?</h2>
            <p>Hi ${user.firstname},</p>
            <p>We'd love to hear about your experience with Mailigo. Could you spare a moment to share your feedback?</p>
            <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Share Feedback</a>
          </div>
        `
      },
      activity: {
        subject: 'Stay Connected with Mailigo',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Don't Miss Out!</h2>
            <p>Hi ${user.firstname},</p>
            <p>We noticed you haven't checked your messages lately. There might be important communications waiting for you!</p>
            <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Check Messages</a>
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
        MessageStream: 'engagements'
      });
      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('Engagement email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendNoReplyEmail(user, notification) {
    try {
      const response = await this.client.sendEmail({
        From: this.defaultSender,
        To: user.email,
        Subject: notification.subject,
        HtmlBody: notification.content,
        MessageStream: 'no-reply'
      });
      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('No-reply email error:', error);
      return { success: false, error: error.message };
    }
  }

  async getEmailAnalytics(messageId) {
    try {
      const opens = await this.client.getMessageOpens({ messageId });
      const clicks = await this.client.getClicksForMessage({ messageId });
      return { opens, clicks };
    } catch (error) {
      console.error('Email analytics error:', error);
      return { error: error.message };
    }
  }
}

module.exports = PostmarkService;