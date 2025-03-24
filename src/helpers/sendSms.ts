import querystring from 'querystring';
import http from 'http';
import config from '../config';

export const sendOtpSms = async (to: string, message: string) => {
  const postData = querystring.stringify({
    token: config.sms.api_token,
    to: to,
    message: message,
  });

  const options = {
    hostname: 'api.bdbulksms.net',
    path: '/api.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
    },
  };

  const req = http.request(options, res => {
    res.setEncoding('utf8');

    res.on('data', chunk => {
      console.log('BODY:', chunk);
    });

    res.on('end', () => {
      console.log('SMS sent successfully.');
    });
  });

  req.on('error', e => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
};
