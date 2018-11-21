const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendMail (to, subject, url) {
  const msg = {
    to: to,
    from: 'projectGodEyes@gmail.com',
    subject: subject,
    // text: 'and easy to do anywhere, even with Node.js',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    templateId: 'd-4ebbf9be969b4873b26c61b18f397919',
    dynamic_template_data: {
      url: url
    }
  }
  sgMail.sendMultiple(msg).then(() => console.log('Mail sent successfully'))
    .catch(error => console.error(error.toString()))
}

module.exports = {
  sendMail: sendMail
}
