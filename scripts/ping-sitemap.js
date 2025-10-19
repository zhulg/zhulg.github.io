const https = require('https');

// 从您的 _config.yml 文件中获取的网站URL
const siteUrl = 'https://zhulg.github.io';
const sitemapUrl = `${siteUrl}/sitemap.xml`;

// Google Ping的URL
const googlePingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

console.log(`Pinging Google with sitemap: ${sitemapUrl}`);

https.get(googlePingUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Successfully pinged Google!');
      console.log('Google\'s response (HTML):');
      console.log(data); // Google返回一个简单的HTML页面确认收到
    } else {
      console.error(`Error pinging Google. Status Code: ${res.statusCode}`);
      console.error('Response:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error sending ping request to Google:');
  console.error(err.message);
});
