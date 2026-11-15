export interface OnboardingEmailData {
  clientName: string;
  invitationTitle: string;
  eventDate?: string;
  invitationUrl?: string;
  dashboardUrl: string;
  isNewUser?: boolean;
}

/**
 * Builds a responsive, brand-aligned HTML email template for Ahvaanam client onboarding.
 * Features cream, ivory, and warm gold accents matching Ahvaanam's royal aesthetic.
 */
export function getOnboardingEmailHtml(data: OnboardingEmailData): string {
  const currentYear = new Date().getFullYear();
  const clientName = data.clientName?.trim() || "Valued Client";
  const invitationTitle = data.invitationTitle?.trim() || "Your Digital Celebration";
  const eventDate = data.eventDate?.trim();
  const invitationUrl = data.invitationUrl;
  const dashboardUrl = data.dashboardUrl;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your invitation is published! Access your Ahvaanam dashboard</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF9F6;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }
    @media screen and (max-width: 620px) {
      .container {
        width: 100% !important;
        padding: 12px !important;
      }
      .content-padding {
        padding: 24px 20px !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .feature-col {
        display: block !important;
        width: 100% !important;
        padding-bottom: 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #241E1C;">

  <!-- Outer Canvas -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; padding: 30px 10px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #EADBCC; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 28px rgba(36, 30, 28, 0.05);">
          
          <!-- Subtle Gold Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #D4AF37 0%, #C49B27 50%, #B8860B 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header / Brand Section -->
          <tr>
            <td align="center" style="padding: 36px 30px 24px 30px; background-color: #FFFDF9; border-bottom: 1px solid #F3EBDD;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 700; letter-spacing: 2.5px; color: #C49B27; text-transform: uppercase; display: inline-block;">
                      AHVAANAM
                    </span>
                    <div style="font-size: 10px; font-weight: 600; letter-spacing: 3.5px; color: #8C7B70; text-transform: uppercase; margin-top: 6px;">
                      Bespoke Digital Celebrations
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Section -->
          <tr>
            <td class="content-padding" style="padding: 36px 40px; background-color: #FFFFFF;">
              
              <!-- Greeting -->
              <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 600; color: #241E1C; line-height: 1.35;">
                Namaste, ${clientName}
              </h1>

              <!-- Confirmation Statement -->
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #4A423D;">
                We are delighted to inform you that your invitation has been successfully published and is now live. Your guests can seamlessly view the celebration details and submit their responses.
              </p>

              <!-- Invitation Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border-left: 3px solid #C49B27; border-radius: 6px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #C49B27; margin-bottom: 6px;">
                      Live Invitation
                    </div>
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: 600; color: #241E1C; line-height: 1.3; margin-bottom: 6px;">
                      ${invitationTitle}
                    </div>
                    ${eventDate ? `
                    <div style="font-size: 13px; color: #6E645D; line-height: 1.4; margin-bottom: 6px;">
                      <strong>Event Date:</strong> ${eventDate}
                    </div>` : ""}
                    ${invitationUrl ? `
                    <div style="font-size: 13px; color: #6E645D; line-height: 1.4;">
                      <strong>Public Link:</strong> <a href="${invitationUrl}" style="color: #C49B27; text-decoration: underline;" target="_blank">${invitationUrl}</a>
                    </div>` : ""}
                  </td>
                </tr>
              </table>

              <!-- Client Dashboard Explanation -->
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 600; color: #241E1C; margin: 0 0 12px 0;">
                Your Ahvaanam Client Dashboard
              </div>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4A423D;">
                Your dedicated client dashboard has been automatically prepared for you. You can oversee every aspect of your celebration in real time:
              </p>

              <!-- Dashboard Feature Highlights -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="top" style="width: 28px; font-size: 16px; line-height: 1.4;">📊</td>
                        <td style="font-size: 14px; line-height: 1.5; color: #3A332F;">
                          <strong>Real-Time Analytics & Tracking:</strong> Monitor total visitor views, device breakdown, and guest engagement as invitations are opened.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="top" style="width: 28px; font-size: 16px; line-height: 1.4;">💌</td>
                        <td style="font-size: 14px; line-height: 1.5; color: #3A332F;">
                          <strong>RSVP & Guest Management:</strong> View confirmed attendees, meal preferences, guest counts, and export organized CSV lists for wedding planners.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="top" style="width: 28px; font-size: 16px; line-height: 1.4;">⭐</td>
                        <td style="font-size: 14px; line-height: 1.5; color: #3A332F;">
                          <strong>Guest Blessings & Feedback:</strong> Read heartwarming blessings, star ratings, and personal notes left by your attendees.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="top" style="width: 28px; font-size: 16px; line-height: 1.4;">📱</td>
                        <td style="font-size: 14px; line-height: 1.5; color: #3A332F;">
                          <strong>Downloadable Share Cards & QR:</strong> Generate high-resolution announcement cards and unique QR codes ready for WhatsApp distribution.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Prominent CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #C49B27; border-radius: 8px;">
                          <a href="${dashboardUrl}" class="cta-button" target="_blank" style="display: inline-block; padding: 16px 38px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border-radius: 8px; border: 1px solid #B8860B;">
                            Access My Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Passwordless & Security Notice -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FDFBF7; border: 1px dashed #E2D7C7; border-radius: 6px; margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 12px; line-height: 1.55; color: #6E645D;">
                      🔒 <strong>Passwordless Authentication:</strong> Clicking the button above instantly authenticates your session without requiring you to remember or create a password. For your privacy and security, this one-time magic link expires in 24 hours.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct URL -->
              <div style="font-size: 12px; line-height: 1.5; color: #8C7B70; margin-bottom: 24px; word-break: break-all;">
                If the button above does not open directly, copy and paste this link into your browser:<br>
                <a href="${dashboardUrl}" style="color: #C49B27; text-decoration: underline;" target="_blank">${dashboardUrl}</a>
              </div>

              <!-- Support & Assistance -->
              <div style="border-top: 1px solid #F0E6D8; padding-top: 20px; font-size: 13px; line-height: 1.6; color: #6E645D;">
                Need help coordinating your portal or updating invitation text? The Ahvaanam team is always available to assist you at
                <a href="mailto:ahvaanam.studio@gmail.com" style="color: #C49B27; font-weight: 600; text-decoration: none;">ahvaanam.studio@gmail.com</a>.
              </div>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #FAF7F2; border-top: 1px solid #EADBCC; font-size: 12px; line-height: 1.5; color: #8C7B70;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: 600; color: #241E1C; margin-bottom: 4px;">
                Ahvaanam Studio
              </div>
              <div style="margin-bottom: 8px;">
                Crafting meaningful, cinematic digital invitation experiences.
              </div>
              <div style="font-size: 11px; color: #A6998F;">
                Sent from ahvaanam.studio@gmail.com &bull; &copy; ${currentYear} Ahvaanam. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Builds clean plain-text version for email clients that do not render HTML.
 */
export function getOnboardingEmailText(data: OnboardingEmailData): string {
  const clientName = data.clientName?.trim() || "Valued Client";
  const invitationTitle = data.invitationTitle?.trim() || "Your Digital Invitation";

  return `NAMASTE, ${clientName.toUpperCase()}

Your digital invitation "${invitationTitle}" has been officially published and is now live!

ACCESS YOUR CLIENT DASHBOARD:
Click the secure one-time link below to log in directly to your Ahvaanam dashboard (no password required):
${data.dashboardUrl}

DASHBOARD FEATURES:
- Real-Time Analytics: Monitor visitor views and guest engagement.
- RSVP Management: View attendee headcount and download guest lists.
- Guest Blessings: Read wishes and ratings submitted by your guests.
- Share Cards: Download high-resolution announcement cards and QR codes.

${data.invitationUrl ? `LIVE INVITATION URL:\n${data.invitationUrl}\n\n` : ""}SECURITY NOTICE:
This magic link is single-use and will expire in 24 hours.

If you require any assistance, please contact us at ahvaanam.studio@gmail.com.

Warm regards,
Ahvaanam Studio
ahvaanam.studio@gmail.com
`;
}
