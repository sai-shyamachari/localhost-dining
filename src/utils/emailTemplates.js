export const getVerificationEmailTemplate = (name, url) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #eeeeee;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333333;
        }
        .content {
          padding: 30px;
          color: #555555;
          line-height: 1.6;
        }
        .content h2 {
          color: #333333;
          font-size: 20px;
          margin-top: 0;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #28a745;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #888888;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LocalHost Dining</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Welcome to LocalHost Dining! We're very excited to have you on board.</p>
          <p>To get started with LocalHost Dining, please verify your email by clicking the button below:</p>
          <div class="button-container">
            <a href="${url}" class="button" style="color: #ffffff;">Click here to confirm your account</a>
          </div>
          <p style="font-size: 12px; color: #888888; margin-top: 20px; line-height: 1.4; word-break: break-all;">
            If the button doesn't work directly in your email app, copy and paste this URL into your browser:<br>
            <a href="${url}" style="color: #28a745; text-decoration: underline;">${url}</a>
          </p>
          <p>Need help, or have questions?<br>Just reply to this email, we'd love to help.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LocalHost Dining. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getPasswordResetEmailTemplate = (name, url) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #eeeeee;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333333;
        }
        .content {
          padding: 30px;
          color: #555555;
          line-height: 1.6;
        }
        .content h2 {
          color: #333333;
          font-size: 20px;
          margin-top: 0;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #007bff;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #888888;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LocalHost Dining</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password for your LocalHost Dining account.</p>
          <p>If you made this request, please click the button below to set a new password:</p>
          <div class="button-container">
            <a href="${url}" class="button" style="color: #ffffff;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #888888; margin-top: 20px; line-height: 1.4; word-break: break-all;">
            If the button doesn't work directly in your email app, copy and paste this URL into your browser:<br>
            <a href="${url}" style="color: #007bff; text-decoration: underline;">${url}</a>
          </p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Need help, or have questions?<br>Just reply to this email, we'd love to help.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LocalHost Dining. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getReservationConfirmationEmailTemplate = (reservation, restaurant, table) => {
  const formattedDate = new Date(reservation.reservationDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reservation Confirmed</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0f17; margin: 0; padding: 20px; color: #333333; }
        .card { max-width: 580px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .hero { background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 35px 25px; text-align: center; color: #ffffff; border-bottom: 3px solid #f59e0b; }
        .hero h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
        .hero p { margin: 8px 0 0; color: #f59e0b; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
        .body { padding: 30px; }
        .greeting { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 15px; }
        .summary-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #6b7280; font-weight: 500; }
        .value { color: #111827; font-weight: 600; text-align: right; }
        .highlight { color: #d97706; font-size: 16px; }
        .note { font-size: 12px; color: #6b7280; line-height: 1.5; margin-top: 20px; background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 10px 12px; border-radius: 0 6px 6px 0; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="hero">
          <h1>LocalHost Dining</h1>
          <p>Table Reservation Confirmed</p>
        </div>
        <div class="body">
          <div class="greeting">Hello ${reservation.guestName || "Valued Guest"},</div>
          <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
            Your table reservation has been locked in and confirmed with zero double-booking concurrency checks. Here are your booking details:
          </p>

          <div class="summary-box">
            <div class="row">
              <span class="label">Restaurant:</span>
              <span class="value highlight">${restaurant.name}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="row">
              <span class="label">Seating Window:</span>
              <span class="value">${reservation.startTime} — ${reservation.endTime}</span>
            </div>
            <div class="row">
              <span class="label">Party Size:</span>
              <span class="value">${reservation.partySize} Guests</span>
            </div>
            <div class="row">
              <span class="label">Assigned Table:</span>
              <span class="value">Table ${table?.tableNumber || "Auto-Allocated"} (${table?.location?.replace("_", " ") || "Main Floor"})</span>
            </div>
            <div class="row">
              <span class="label">Venue Address:</span>
              <span class="value">${restaurant.address?.street || ""}, ${restaurant.neighborhood}</span>
            </div>
            <div class="row">
              <span class="label">Confirmation ID:</span>
              <span class="value" style="font-family: monospace; font-size: 12px;">${reservation._id}</span>
            </div>
          </div>

          ${
            reservation.specialRequests
              ? `<div class="note"><strong>Special Note:</strong> "${reservation.specialRequests}"</div>`
              : ""
          }

          <p style="margin-top: 25px; font-size: 13px; color: #4b5563; line-height: 1.5;">
            If your schedule changes, you can manage or release your reservation at any time directly through your <a href="http://localhost:3000/my-bookings" style="color: #d97706; font-weight: bold;">My Bookings</a> dashboard.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LocalHost Dining Platform. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getReservationCancelledEmailTemplate = (reservation, restaurant) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reservation Cancelled</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0f17; margin: 0; padding: 20px; color: #333333; }
        .card { max-width: 580px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .hero { background: #111827; padding: 30px 25px; text-align: center; color: #ffffff; border-bottom: 3px solid #ef4444; }
        .hero h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .body { padding: 30px; font-size: 14px; line-height: 1.6; color: #4b5563; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="hero">
          <h1>Reservation Cancelled</h1>
        </div>
        <div class="body">
          <p>Hi ${reservation.guestName || "Guest"},</p>
          <p>Your table reservation at <strong>${restaurant?.name || "Local Restaurant"}</strong> for <strong>${reservation.startTime}</strong> on <strong>${new Date(reservation.reservationDate).toLocaleDateString()}</strong> has been cancelled and your table released.</p>
          ${reservation.cancellationReason ? `<p><em>Reason: ${reservation.cancellationReason}</em></p>` : ""}
          <p>We look forward to serving you another time. You can explore and book other tables whenever you're ready at <a href="http://localhost:3000/restaurants" style="color: #ef4444;">LocalHost Dining</a>.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LocalHost Dining. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
