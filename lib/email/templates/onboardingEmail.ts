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
 * Builds an attractive, wedding-stationery-inspired luxury HTML email for Ahvaanam client onboarding.
 * Features the actual brand logo, royal gold accents, elegant 2-column feature cards,
 * and warm celebratory copy with zero admin-only metrics.
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
      background-color: #F5F0E6;
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
      .outer-padding {
        padding: 16px 8px !important;
      }
      .container-card {
        width: 100% !important;
      }
      .card-body-padding {
        padding: 28px 20px !important;
      }
      .feature-cell {
        display: block !important;
        width: 100% !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
        margin-bottom: 10px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F0E6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2E2620;">

  <!-- Outer Background Canvas -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-padding" style="background-color: #F5F0E6; padding: 36px 14px;">
    <tr>
      <td align="center">

        <!-- Outer Double-Border Envelope Container -->
        <table class="container-card" width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; background-color: #FFFDF9; border: 1px solid #D8C39D; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 30px rgba(46, 38, 32, 0.07);">
          
          <!-- Top Royal Gold Foil Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #A88234 0%, #E3C37B 50%, #A88234 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header Section with Actual Logo -->
          <tr>
            <td align="center" style="padding: 38px 24px 22px 24px; background-color: #FFFDF9;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center">
                    <img 
                      src="${logoUrl}" 
                      alt="Ahvaanam" 
                      width="186" 
                      height="43" 
                      border="0" 
                      style="display: block; margin: 0 auto; width: 186px; max-width: 100%; height: auto; border: 0;"
                    />
                    <!-- Delicate Gold Foil Accent Flourish -->
                    <div style="margin: 16px auto 0 auto; width: 90px; height: 1px; background: linear-gradient(90deg, transparent, #C5A059, transparent);"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Letter Content -->
          <tr>
            <td class="card-body-padding" style="padding: 32px 38px 30px 38px; background-color: #FFFFFF; border-top: 1px solid #F3EBDF;">

              <!-- Primary Invitation Announcement -->
              <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 25px; font-weight: 600; color: #1F1A17; line-height: 1.35; text-align: center;">
                Your celebration is ready to be shared.
              </h1>

              <!-- Personalized Greeting -->
              <div style="font-size: 15px; font-weight: 600; color: #1F1A17; margin: 24px 0 12px 0;">
                Dear ${clientName},
              </div>

              <!-- Warm Opening Copy -->
              <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.7; color: #52473D;">
                There&#39;s something truly special about bringing your loved ones together. We&#39;re delighted to let you know that your custom invitation is now live on Ahvaanam!
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: #52473D;">
                Your celebration is ready to reach the people who matter most.
              </p>

              <!-- Elegant Wedding Stationery Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF5EB; border: 1px solid #DFC9A3; border-radius: 8px; margin: 0 0 32px 0;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <!-- Badge -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 8px;">
                      <tr>
                        <td style="background-color: #F2E8D3; border: 1px solid #DFC9A3; border-radius: 3px; padding: 3px 8px; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; color: #8F6C22; text-transform: uppercase;">
                          ✦ &nbsp; YOUR INVITATION IS LIVE &nbsp; ✦
                        </td>
                      </tr>
                    </table>

                    <!-- Couple / Event Title -->
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 21px; font-weight: 600; color: #1F1A17; line-height: 1.3; margin-bottom: 8px;">
                      ${invitationTitle}
                    </div>

                    ${eventDate ? `
                    <div style="font-size: 13px; color: #6E5F52; line-height: 1.5; margin-bottom: 10px;">
                      <strong>Event Date:</strong> ${eventDate}
                    </div>` : ""}

                    <!-- Link Pill -->
                    <div>
                      <a href="${productionInviteUrl}" target="_blank" style="display: inline-block; padding: 7px 16px; background-color: #FFFFFF; border: 1px solid #D5BE95; border-radius: 4px; font-size: 12px; font-weight: 600; color: #8F6C22; text-decoration: none;">
                        View Live Invitation &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Dashboard Feature Showcase -->
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; color: #1F1A17; margin-bottom: 6px;">
                  Your celebration, at your fingertips.
                </div>
                <div style="font-size: 13px; line-height: 1.6; color: #63584E; max-width: 440px; margin: 0 auto;">
                  We&#39;ve prepared a personal space for you to follow your invitation and stay connected with your guests in real time.
                </div>
              </div>

              <!-- 2x2 Feature Matrix Cards -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <!-- Row 1 -->
                <tr>
                  <td width="50%" class="feature-cell" style="padding-right: 6px; padding-bottom: 12px;" valign="top">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border: 1px solid #ECE2D2; border-radius: 8px; padding: 14px 14px; min-height: 80px;">
                      <tr>
                        <td valign="top" style="font-size: 18px; line-height: 1; padding-right: 10px;">📊</td>
                        <td valign="top">
                          <div style="font-size: 13px; font-weight: 700; color: #1F1A17; margin-bottom: 3px;">
                            Invitation Insights
                          </div>
                          <div style="font-size: 12px; line-height: 1.45; color: #695D52;">
                            Discover visitor activity and guest engagement in real time.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" class="feature-cell" style="padding-left: 6px; padding-bottom: 12px;" valign="top">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border: 1px solid #ECE2D2; border-radius: 8px; padding: 14px 14px; min-height: 80px;">
                      <tr>
                        <td valign="top" style="font-size: 18px; line-height: 1; padding-right: 10px;">💌</td>
                        <td valign="top">
                          <div style="font-size: 13px; font-weight: 700; color: #1F1A17; margin-bottom: 3px;">
                            RSVP &amp; Guest Responses
                          </div>
                          <div style="font-size: 12px; line-height: 1.45; color: #695D52;">
                            Keep track of confirmations, headcounts, and guest attendance.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Row 2 -->
                <tr>
                  <td width="50%" class="feature-cell" style="padding-right: 6px;" valign="top">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border: 1px solid #ECE2D2; border-radius: 8px; padding: 14px 14px; min-height: 80px;">
                      <tr>
                        <td valign="top" style="font-size: 18px; line-height: 1; padding-right: 10px;">✨</td>
                        <td valign="top">
                          <div style="font-size: 13px; font-weight: 700; color: #1F1A17; margin-bottom: 3px;">
                            Blessings &amp; Memories
                          </div>
                          <div style="font-size: 12px; line-height: 1.45; color: #695D52;">
                            Explore the heartfelt wishes and messages shared by loved ones.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" class="feature-cell" style="padding-left: 6px;" valign="top">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border: 1px solid #ECE2D2; border-radius: 8px; padding: 14px 14px; min-height: 80px;">
                      <tr>
                        <td valign="top" style="font-size: 18px; line-height: 1; padding-right: 10px;">📲</td>
                        <td valign="top">
                          <div style="font-size: 13px; font-weight: 700; color: #1F1A17; margin-bottom: 3px;">
                            Sharing &amp; QR Tools
                          </div>
                          <div style="font-size: 12px; line-height: 1.45; color: #695D52;">
                            Access available sharing materials, download cards, and QR codes.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Prominent Gold CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 14px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #A37E30; border-radius: 6px;">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${dashboardUrl}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="12%" stroke="f" fillcolor="#A37E30">
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;">EXPLORE YOUR DASHBOARD</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a 
                            href="${dashboardUrl}" 
                            target="_blank" 
                            style="display: inline-block; padding: 16px 42px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #FFFFFF; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; border-radius: 6px; border: 1px solid #8C6A20; box-shadow: 0 4px 15px rgba(163, 126, 48, 0.28);"
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

              <!-- Passwordless Security Note -->
              <p style="text-align: center; font-size: 12px; line-height: 1.6; color: #8A7B6D; margin: 0 auto 16px auto; max-width: 460px;">
                Your dashboard is protected with secure passwordless access. Simply click the button above to get started. This one-time access link expires after 24 hours.
              </p>

            </td>
          </tr>

          <!-- Refined Prestigious Footer -->
          <tr>
            <td align="center" style="padding: 26px 30px 28px 30px; background-color: #FAF5EB; border-top: 1px solid #EAE0CE; font-size: 12px; line-height: 1.65; color: #8C7B6D;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 600; color: #1F1A17; margin-bottom: 5px;">
                Honored to craft timeless memories for your celebration.
              </div>
              <div style="margin-bottom: 10px; color: #6E5F52;">
                With warm regards,<br>
                <strong style="color: #1F1A17;">Team Ahvaanam</strong>
              </div>
              <div style="font-size: 11px; color: #9A8A7C;">
                Questions or special requests? Reach us at 
                <a href="mailto:ahvaanam.studio@gmail.com" style="color: #8F6C22; text-decoration: none; font-weight: 600;">ahvaanam.studio@gmail.com</a>
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
 * Builds clean plain-text alternative matching the new copy.
 */
export function getOnboardingEmailText(data: OnboardingEmailData): string {
  const clientName = data.clientName?.trim() || "Valued Client";
  const invitationTitle = data.invitationTitle?.trim() || "Your Celebration";
  const productionInviteUrl = normalizeProductionInvitationUrl(data.invitationUrl);

  return `AHVAANAM
INVITE BEAUTIFULLY

YOUR CELEBRATION IS READY TO BE SHARED.

Dear ${clientName},

There's something truly special about bringing your loved ones together. We're delighted to let you know that your custom invitation is now live on Ahvaanam!

Your celebration is ready to reach the people who matter most.

✦ YOUR INVITATION IS LIVE ✦
${invitationTitle}
${data.eventDate ? `Event Date: ${data.eventDate}\n` : ""}Invitation Link: ${productionInviteUrl}

YOUR CELEBRATION, AT YOUR FINGERTIPS:
We've prepared a personal space for you to follow your invitation and stay connected with your guests.

- Invitation Insights: Discover visitor activity and guest engagement in real time.
- RSVP & Guest Responses: Keep track of confirmations, headcounts, and guest attendance.
- Blessings & Memories: Explore the heartfelt wishes and messages shared by loved ones.
- Sharing & QR Tools: Access available sharing materials, download cards, and QR codes.

EXPLORE YOUR DASHBOARD:
${data.dashboardUrl}

Your dashboard is protected with secure passwordless access. Simply click the link above to get started. This one-time access link expires after 24 hours.

Honored to craft timeless memories for your celebration.
With warm regards,
Team Ahvaanam
Concierge: ahvaanam.studio@gmail.com
`;
}
