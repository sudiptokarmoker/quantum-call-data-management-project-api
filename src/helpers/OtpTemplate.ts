export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options).replace(',', '');
};

export const OtpTemplate = (otp: number, name: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP from Renesa Bazar</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f4f8;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #4a90e2, #5cb3ff);">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Renesa Bazar</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #4a90e2; margin-bottom: 20px; font-size: 24px; font-weight: bold; text-align: center;">Password Reset OTP</h2>
                <p style="margin-bottom: 20px; font-size: 16px; color: #555; text-align: center;">Hello ${name}, thank you for choosing Renesa Bazar. Use the following OTP to complete the procedure to reset your password. This OTP is valid for 5 minutes.</p>
                <div style="background: linear-gradient(135deg, #f0f7ff, #e6f3ff); border: 2px dashed #4a90e2; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #4a90e2; font-size: 42px; margin: 0; letter-spacing: 8px; font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.1);">${otp}</h2>
                </div>
                <p style="margin-bottom: 20px; font-size: 16px; color: #666; text-align: center; font-style: italic;">Do not share this code with others, including Renesa Bazar employees.</p>
                <p style="margin-bottom: 30px; font-size: 14px; color: #888; text-align: center;">If you didn't request this OTP, please ignore this email or contact our support team if you have any concerns.</p>
                
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 25px 30px; text-align: center; font-size: 14px; color: #666;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Renesa Bazar. All rights reserved.</p>
                <p style="margin: 10px 0 0;">
                    <a href="https://renesabazar.com/privacy-policy" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="https://renesabazar.com/term-and-condition" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
