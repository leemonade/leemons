function testEmail(text) {
  return `
  <html>
    <head>
      <style></style>
    </head>
     <body>
     ${text}
     </body>
  </html>
  `;
}

module.exports = {
  es: testEmail('Esto es un texto de ejemplo para comprobar que te llegan los emails'),
  en: testEmail('This is an example text to check that you receive the e-mails'),
};
