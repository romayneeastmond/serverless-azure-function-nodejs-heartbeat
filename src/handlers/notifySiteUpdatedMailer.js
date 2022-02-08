
const nodemailer = require('nodemailer');

const httpHandler = async (context, smtpServerName, smtpUser, smtpPassword, subject, to, sites, source, from) => {
    let body = [];

    body.push(`Please note that your ${sites.length > 1 ? 'sites have' : 'site has'} been updated.`);
    body.push('');

    sites.forEach((site) => {
        body.push(site);
    });

    body.push('');
    body.push(`Message sent on ${new Date()}`);
    body.push(`Sent from ${source}`);

    let transporter = nodemailer.createTransport({
        host: smtpServerName,
        port: 587,
        secure: false,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        },
    });

    let info = await transporter.sendMail({
        from,
        to,
        subject,
        text: body.join('\r\n')
    });

    context.log(`${new Date()} Message sent ${info.messageId}`);
    context.log(`${new Date()} End run NotifySiteUpdatedMailer.`);

    return info.messageId;
}

module.exports.handler = async function (context, req) {
    context.log(`${new Date()} Called NotifySiteUpdatedMailer.`);

    if (req.body.subject && req.body.to && req.body.sites && req.body.source) {
        const smtpServerName = process.env['SMTP_SERVER_NAME'];
        const smtpUser = process.env['SMTP_USER'];
        const smtpPassword = process.env['SMTP_PASSWORD'];
        const mailFrom = process.env['MAIL_FROM'];

        await httpHandler(context, smtpServerName, smtpUser, smtpPassword, req.body.subject, req.body.to, req.body.sites.split(','), req.body.source, mailFrom);

        context.res = {
            body: 'Message sent.',
        };
    } else {
        context.res = {
            status: 400,
            body: 'Requires subject, to, sites (comma separated), and source parameters.',
        };
    }

    context.log(`${new Date()} End NotifySiteUpdatedMailer.`);
};