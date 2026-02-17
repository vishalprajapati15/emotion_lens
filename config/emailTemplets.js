export const WELCOME_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width" />

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600;700;900&family=Roboto:wght@400&display=swap" rel="stylesheet" />
</head>

<body style="margin:0;padding:0;background-color:#292929;">

  <table width="100%" cellpadding="0" cellspacing="0" align="center"
    style="background-color:#292929;">
    <tr>
      <td align="center">

        <!-- Spacer -->
        <div style="height:60px;"></div>

        <!-- Main Card -->
        <table width="440" cellpadding="0" cellspacing="0"
          style="border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#CDD6B0;padding:26px;text-align:center;">
              <h1 style="font-size:35px;font-weight:900;color:#121212;
                text-align:center;margin:0;">
                Emotion Lens
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;
              font-family:Inter Tight, Arial, sans-serif;">

              <!-- Title -->
              <h1 style="font-size:35px;font-weight:900;color:#121212;
                text-align:center;margin:0;">
                Welcome 🎉
              </h1>

              <div style="height:20px;"></div>

              <!-- Message -->
              <p style="font-family:Roboto, Arial, sans-serif;
                font-size:16px;line-height:22px;color:#111111;margin:0;">
                Hey <b>{{username}}</b>,  
                Welcome to <b>Emotion Lens</b>! 🚀  
                We're super excited to have you onboard.
              </p>

              <div style="height:25px;"></div>

              <!-- Welcome Box -->
              <div style="
                background-color:#CDD6B0;
                padding:22px;
                text-align:center;
                border-radius:12px;
                font-size:20px;
                font-weight:700;
                color:#292929;
                line-height:28px;">
                Your account has been successfully created ✅  
                Start exploring now!
              </div>

              <div style="height:25px;"></div>

              <!-- Button -->
              <div style="text-align:center;">
                <a href="{{loginLink}}" style="
                  display:inline-block;
                  padding:14px 28px;
                  background-color:#292929;
                  color:#ffffff;
                  font-size:15px;
                  font-weight:700;
                  text-decoration:none;
                  border-radius:10px;">
                  Go to Dashboard →
                </a>
              </div>

              <div style="height:25px;"></div>

              <!-- Footer Note -->
              <p style="font-size:13px;color:#121212;
                line-height:20px;margin:0;">
                If you ever need help, feel free to reach out to our support team anytime 💬
              </p>

              <div style="height:20px;"></div>

              <!-- Support -->
              <p style="font-size:13px;color:#121212;margin:0;">
                Need assistance?  
                <a href="#" style="font-weight:700;color:#121212;
                  text-decoration:none;">
                  Contact Support
                </a>
              </p>

            </td>
          </tr>

        </table>

        <!-- Spacer -->
        <div style="height:30px;"></div>

        <!-- Bottom Note -->
        <table width="260" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 20px;font-family:Inter Tight, Arial, sans-serif;">
              <p style="font-size:12px;color:#878787;
                line-height:16px;margin:0;">
                Flash is a secure web platform for managing authentication and user accounts.
              </p>
            </td>
          </tr>
        </table>

        <div style="height:60px;"></div>

      </td>
    </tr>
  </table>

</body>
</html>
`



export const PASSWORD_RESET_TEMPLATE= `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width" />

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600;700;900&family=Roboto:wght@400&display=swap" rel="stylesheet" />
</head>

<body style="margin:0;padding:0;background-color:#292929;">

  <table width="100%" cellpadding="0" cellspacing="0" align="center"
    style="background-color:#292929;">
    <tr>
      <td align="center">

        <!-- Spacer -->
        <div style="height:60px;"></div>

        <!-- Main Card -->
        <table width="440" cellpadding="0" cellspacing="0"
          style="border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#CDD6B0;padding:26px;text-align:center;">
              <h1 style="font-size:35px;font-weight:900;color:#121212;
                text-align:center;margin:0;">
                Emotion Lens
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;
              font-family:Inter Tight, Arial, sans-serif;">

              <!-- Title -->
              <h1 style="font-size:35px;font-weight:900;color:#121212;
                text-align:center;margin:0;">
                Reset Your Password
              </h1>

              <div style="height:20px;"></div>

              <!-- Message -->
              <p style="font-family:Roboto, Arial, sans-serif;
                font-size:16px;line-height:22px;color:#111111;margin:0;">
                We received a request to reset your password 🔐  
                Please use the OTP below to continue.
              </p>

              <div style="height:25px;"></div>

              <!-- OTP Box -->
              <div style="
                background-color:#CDD6B0;
                padding:18px;
                text-align:center;
                border-radius:12px;
                font-size:28px;
                font-weight:700;
                letter-spacing:6px;
                color:#292929;">
                {{otp}}
              </div>

              <div style="height:20px;"></div>

              <!-- Expiry Info -->
              <p style="font-size:13px;color:#121212;
                line-height:20px;margin:0;">
                This OTP is valid for <b>15 minutes</b>.  
                Please do not share it with anyone.
              </p>

              <div style="height:20px;"></div>

              <!-- Warning -->
              <p style="font-size:13px;color:#121212;margin:0;">
                Didn’t request a password reset?  
                <a href="#" style="font-weight:700;color:#121212;
                  text-decoration:none;">
                  Contact Support
                </a>
              </p>

            </td>
          </tr>

        </table>

        <!-- Spacer -->
        <div style="height:30px;"></div>

        <!-- Bottom Note -->
        <table width="260" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 20px;font-family:Inter Tight, Arial, sans-serif;">
              <p style="font-size:12px;color:#878787;
                line-height:16px;margin:0;">
                Flash is a secure web platform for managing authentication and user accounts.
              </p>
            </td>
          </tr>
        </table>

        <div style="height:60px;"></div>

      </td>
    </tr>
  </table>

</body>
</html>
`