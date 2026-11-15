export interface OnboardingEmailData {
  clientName: string;
  invitationTitle: string;
  eventDate?: string;
  invitationUrl?: string;
  dashboardUrl: string;
  isNewUser?: boolean;
}

/**
 * Escapes dynamic string values to prevent HTML injection in emails.
 */
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Ensures the public invitation URL uses the production domain (never localhost).
 */
function normalizeProductionInvitationUrl(url?: string): string {
  if (!url) return "https://ahvaanam.in";
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return url.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, "https://ahvaanam.in");
  }
  return url;
}

/**
 * Builds a wedding-stationery-inspired, premium HTML email for Ahvaanam client onboarding.
 * Incorporates the actual Ahvaanam logo, warm ivory backdrop, refined gold accents,
 * and elegant serif headings. Strictly client-accessible content only.
 */
export function getOnboardingEmailHtml(data: OnboardingEmailData): string {
  const currentYear = new Date().getFullYear();
  const rawClientName = data.clientName?.trim() || "Valued Client";
  const rawTitle = data.invitationTitle?.trim() || "Your Celebration";
  const rawDate = data.eventDate?.trim() || "";

  const clientName = escapeHtml(rawClientName);
  const invitationTitle = escapeHtml(rawTitle);
  const eventDate = escapeHtml(rawDate);
  const productionInviteUrl = normalizeProductionInvitationUrl(data.invitationUrl);
  const dashboardUrl = data.dashboardUrl;

  // Actual Ahvaanam logo hosted on verified production domain over HTTPS
  const logoUrl = "https://ahvaanam.in/images/logo.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your wedding invitation is published! Access your Ahvaanam dashboard.</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Georgia, 'Times New Roman', serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F4EE;
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
    @media screen and (max-width: 600px) {
      .container-table {
        width: 100% !important;
        margin: 0 auto !important;
      }
      .content-padding {
        padding: 28px 20px !important;
      }
      .feature-box {
        padding: 12px 14px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2E2620;">

  <!-- Outer Canvas -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F4EE; padding: 32px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table class="container-table" width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; background-color: #FFFFFF; border: 1px solid #E6DCCD; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(46, 38, 32, 0.04);">
          
          <!-- Delicate Gold Top Accent -->
          <tr>
            <td height="3" style="background-color: #9B7829; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>

          <!-- Header with Actual Ahvaanam Logo -->
          <tr>
            <td align="center" style="padding: 36px 24px 20px 24px; background-color: #FCFBF8; border-bottom: 1px solid #F0E8DC;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center">
                    <img 
                      src="${logoUrl}" 
                      alt="Ahvaanam" 
                      width="180" 
                      height="41" 
                      border="0" 
                      style="display: block; margin: 0 auto; width: 180px; max-width: 100%; height: auto; border: 0;"
                    />
                    <div style="font-size: 10px; font-weight: 600; letter-spacing: 3.5px; color: #9A8877; text-transform: uppercase; margin-top: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      BESPOKE DIGITAL CELEBRATIONS
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="content-padding" style="padding: 36px 38px 30px 38px; background-color: #FFFFFF;">

              <!-- Main Heading -->
              <h1 style="margin: 0 0 20px 0; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600; color: #2E2620; line-height: 1.35; text-align: center;">
                Your celebration is ready to be shared.
              </h1>

              <!-- Subtle Divider Line -->
              <table width="60" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 24px auto;">
                <tr>
                  <td height="1" style="background-color: #C8A85B; line-height: 1px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- Personalized Greeting -->
              <div style="font-size: 15px; font-weight: 600; color: #2E2620; margin: 0 0 14px 0;">
                Dear ${clientName},
              </div>

              <!-- Warm Body Statement -->
              <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.7; color: #554A40;">
                There&#39;s something special about bringing your loved ones together. We&#39;re delighted to let you know that your invitation is now live on Ahvaanam!
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: #554A40;">
                Your celebration is ready to reach the people who matter most.
              </p>

              <!-- Elegant Event Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F0; border: 1px solid #EAE0CE; border-left: 3px solid #9B7829; border-radius: 6px; margin: 0 0 28px 0;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #9B7829; text-transform: uppercase; margin-bottom: 6px;">
                      YOUR INVITATION IS LIVE
                    </div>
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: 600; color: #2E2620; line-height: 1.3; margin-bottom: 6px;">
                      ${invitationTitle}
                    </div>
                    ${eventDate ? `
                    <div style="font-size: 13px; color: #6C5F53; line-height: 1.5; margin-bottom: 6px;">
                      <strong>Event Date:</strong> ${eventDate}
                    </div>` : ""}
                    <div style="font-size: 13px; color: #6C5F53; line-height: 1.5; word-break: break-all;">
                      <strong>Invitation Link:</strong> <a href="${productionInviteUrl}" style="color: #9B7829; text-decoration: underline;" target="_blank">${productionInviteUrl}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Dashboard Introduction Section -->
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: 600; color: #2E2620; margin: 0 0 6px 0;">
                Your celebration, at your fingertips.
              </div>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #554A40;">
                We&#39;ve prepared a personal space for you to follow your invitation and stay connected with your guests.
              </p>

              <!-- 4 Client-Accessible Features List -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table border="0" cellspacing="0" cellpadding="0" width="100%" class="feature-box" style="background-color: #FAF8F5; border-radius: 6px; padding: 12px 16px;">
                      <tr>
                        <td valign="top" style="width: 20px; font-size: 12px; line-height: 1.6; color: #9B7829;">✦</td>
                        <td style="font-size: 13px; line-height: 1.55; color: #40362E;">
                          <strong style="color: #2E2620;">Invitation Insights</strong> &mdash; View invitation visits and guest engagement.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table border="0" cellspacing="0" cellpadding="0" width="100%" class="feature-box" style="background-color: #FAF8F5; border-radius: 6px; padding: 12px 16px;">
                      <tr>
                        <td valign="top" style="width: 20px; font-size: 12px; line-height: 1.6; color: #9B7829;">✦</td>
                        <td style="font-size: 13px; line-height: 1.55; color: #40362E;">
                          <strong style="color: #2E2620;">RSVP &amp; Guest Responses</strong> &mdash; Track attendance confirmations and guest responses.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table border="0" cellspacing="0" cellpadding="0" width="100%" class="feature-box" style="background-color: #FAF8F5; border-radius: 6px; padding: 12px 16px;">
                      <tr>
                        <td valign="top" style="width: 20px; font-size: 12px; line-height: 1.6; color: #9B7829;">✦</td>
                        <td style="font-size: 13px; line-height: 1.55; color: #40362E;">
                          <strong style="color: #2E2620;">Blessings &amp; Memories</strong> &mdash; Read messages and wishes shared by guests.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0" width="100%" class="feature-box" style="background-color: #FAF8F5; border-radius: 6px; padding: 12px 16px;">
                      <tr>
                        <td valign="top" style="width: 20px; font-size: 12px; line-height: 1.6; color: #9B7829;">✦</td>
                        <td style="font-size: 13px; line-height: 1.55; color: #40362E;">
                          <strong style="color: #2E2620;">Sharing &amp; Invitation Tools</strong> &mdash; Access available invitation sharing materials and QR codes.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Prominent CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #9B7829; border-radius: 6px;">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${dashboardUrl}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="12%" stroke="f" fillcolor="#9B7829">
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;">EXPLORE YOUR DASHBOARD</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a 
                            href="${dashboardUrl}" 
                            target="_blank" 
                            style="display: inline-block; padding: 15px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #FFFFFF; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 6px; border: 1px solid #85641C;"
                          >
                            EXPLORE YOUR DASHBOARD
                          </a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Message -->
              <p style="text-align: center; font-size: 12px; line-height: 1.55; color: #8A7B6D; margin: 0 auto 18px auto; max-width: 460px;">
                Your dashboard is protected with secure passwordless access. Simply click the button above to get started. This one-time access link expires after 24 hours.
              </p>

            </td>
          </tr>

          <!-- Minimal Premium Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px 28px 30px; background-color: #FAF7F0; border-top: 1px solid #EAE0CE; font-size: 12px; line-height: 1.6; color: #8E7E70;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: 600; color: #2E2620; margin-bottom: 4px;">
                Made with care for your most meaningful celebrations.
              </div>
              <div style="margin-bottom: 6px; color: #6E6155;">
                With love, Team Ahvaanam
              </div>
              <div style="font-size: 11px; color: #A6998F;">
                Questions? Write to us at <a href="mailto:ahvaanam.studio@gmail.com" style="color: #9B7829; text-decoration: none; font-weight: 500;">ahvaanam.studio@gmail.com</a>
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
 * Builds clean plain-text alternative matching the new concise copy.
 */
export function getOnboardingEmailText(data: OnboardingEmailData): string {
  const clientName = data.clientName?.trim() || "Valued Client";
  const invitationTitle = data.invitationTitle?.trim() || "Your Celebration";
  const productionInviteUrl = normalizeProductionInvitationUrl(data.invitationUrl);

  return `AHVAANAM
BESPOKE DIGITAL CELEBRATIONS

YOUR CELEBRATION IS READY TO BE SHARED.

Dear ${clientName},

There's something special about bringing your loved ones together. We're delighted to let you know that your invitation is now live on Ahvaanam!

Your celebration is ready to reach the people who matter most.

YOUR INVITATION IS LIVE:
${invitationTitle}
${data.eventDate ? `Event Date: ${data.eventDate}\n` : ""}Invitation Link: ${productionInviteUrl}

YOUR CELEBRATION, AT YOUR FINGERTIPS:
We've prepared a personal space for you to follow your invitation and stay connected with your guests.

- Invitation Insights: View invitation visits and guest engagement.
- RSVP & Guest Responses: Track attendance confirmations and guest responses.
- Blessings & Memories: Read messages and wishes shared by guests.
- Sharing & Invitation Tools: Access available invitation sharing materials and QR codes.

EXPLORE YOUR DASHBOARD:
${data.dashboardUrl}

Your dashboard is protected with secure passwordless access. Simply click the link above to get started. This one-time access link expires after 24 hours.

Made with care for your most meaningful celebrations.
With love, Team Ahvaanam
Support: ahvaanam.studio@gmail.com
`;
}
