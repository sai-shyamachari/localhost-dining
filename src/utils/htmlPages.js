/**
 * Self-contained, responsive, luxury HTML pages rendered directly by Express
 * for Email Verification and Password Reset browser flows.
 */

export const renderEmailVerifiedHtml = (userName = "Valued Diner", loginUrl = "/login") => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified | LocalHost Dining</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b0f17;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(18, 24, 38, 0.85);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.1);
      backdrop-filter: blur(16px);
      max-width: 480px;
      width: 100%;
      padding: 44px 36px;
      text-align: center;
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .icon-container {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 2px solid rgba(16, 185, 129, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);
    }
    .icon-container svg {
      width: 44px;
      height: 44px;
      stroke: #10b981;
      stroke-width: 2.2;
      fill: none;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 700;
      color: #f59e0b;
      margin-bottom: 8px;
    }
    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .name-highlight {
      color: #f59e0b;
      font-weight: 600;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
      color: #0b0f17;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 14px 24px;
      border-radius: 14px;
      box-shadow: 0 10px 20px rgba(245, 158, 11, 0.25);
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(245, 158, 11, 0.35);
      filter: brightness(1.05);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 24px;
      font-size: 12px;
      color: #64748b;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-container">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <div class="brand">LocalHost Dining</div>
    <h1>Email Verified!</h1>
    <p>Welcome, <span class="name-highlight">${userName}</span>. Your account is now fully active. You can start exploring curated tables and booking reservations.</p>
    <a href="${loginUrl}" class="btn">
      <span>Proceed to Sign In</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </a>
    <div class="badge">
      <span class="badge-dot"></span>
      <span>Live concurrency engine ready</span>
    </div>
  </div>
</body>
</html>`;
};

export const renderEmailVerificationErrorHtml = (
  errorMessage = "Invalid or expired verification token.",
  title = "Link Expired or Invalid",
  actionText = "Return to Sign In",
  actionUrl = "/login"
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | LocalHost Dining</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b0f17;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(18, 24, 38, 0.85);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(16px);
      max-width: 480px;
      width: 100%;
      padding: 44px 36px;
      text-align: center;
    }
    .icon-container {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.15);
      border: 2px solid rgba(239, 68, 68, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-container svg {
      width: 44px;
      height: 44px;
      stroke: #ef4444;
      stroke-width: 2.2;
      fill: none;
    }
    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      color: #ffffff;
      margin-bottom: 12px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-block;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 14px 24px;
      border-radius: 14px;
      transition: all 0.2s;
    }
    .btn:hover { background: rgba(255, 255, 255, 0.15); }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-container">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    <h1>${title}</h1>
    <p>${errorMessage}</p>
    <a href="${actionUrl}" class="btn">${actionText}</a>
  </div>
</body>
</html>`;
};

export const renderResetPasswordHtml = (token, postUrl = `/api/v1/auth/reset-password/${token}`, loginUrl = "/login") => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password | LocalHost Dining</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b0f17;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(18, 24, 38, 0.85);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.1);
      backdrop-filter: blur(16px);
      max-width: 480px;
      width: 100%;
      padding: 44px 36px;
      text-align: left;
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .icon-container {
      width: 68px;
      height: 68px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: rgba(245, 158, 11, 0.15);
      border: 2px solid rgba(245, 158, 11, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 24px rgba(245, 158, 11, 0.2);
    }
    .icon-container svg {
      width: 34px;
      height: 34px;
      stroke: #f59e0b;
      stroke-width: 2.2;
      fill: none;
    }
    .header-text {
      text-align: center;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 700;
      color: #f59e0b;
      margin-bottom: 6px;
    }
    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 30px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    p {
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.5;
    }
    .form-group {
      margin-bottom: 18px;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 12px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }
    input:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
      color: #0b0f17;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 14px 24px;
      border-radius: 14px;
      box-shadow: 0 10px 20px rgba(245, 158, 11, 0.25);
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      margin-top: 24px;
    }
    .btn:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .alert {
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 12px;
      margin-bottom: 18px;
      display: none;
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .alert-success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card" id="mainCard">
    <div class="icon-container">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div class="header-text">
      <div class="brand">LocalHost Dining</div>
      <h1>Set New Password</h1>
      <p>Please enter and confirm your new secure password below.</p>
    </div>

    <div id="errorAlert" class="alert alert-error"></div>
    <div id="successAlert" class="alert alert-success"></div>

    <form id="resetForm">
      <div class="form-group">
        <label for="password">New Password (minimum 6 characters)</label>
        <input type="password" id="password" required minlength="6" placeholder="••••••••">
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm New Password</label>
        <input type="password" id="confirmPassword" required minlength="6" placeholder="••••••••">
      </div>
      <button type="submit" id="submitBtn" class="btn">
        <span>Save New Password</span>
      </button>
    </form>
  </div>

  <script>
    const form = document.getElementById('resetForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      errorAlert.style.display = 'none';

      if (password.length < 6) {
        errorAlert.textContent = 'Password must be at least 6 characters.';
        errorAlert.style.display = 'block';
        return;
      }

      if (password !== confirmPassword) {
        errorAlert.textContent = 'Passwords do not match.';
        errorAlert.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Updating...';

      try {
        const response = await fetch('${postUrl}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update password.');
        }

        form.style.display = 'none';
        successAlert.innerHTML = '<strong>Password Updated Successfully!</strong><br><br>Your password has been securely reset. You can now log into your account.<br><br><a href="${loginUrl}" class="btn" style="margin-top: 14px;">Sign In Now</a>';
        successAlert.style.display = 'block';
      } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save New Password';
      }
    });
  </script>
</body>
</html>`;
};
