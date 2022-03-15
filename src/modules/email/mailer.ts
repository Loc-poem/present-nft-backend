import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';

export class Mailer {
  public static sendEmail(toEmail, subject: string, dir: string, template: string, context: object) {
    const adminEmail = process.env.STORE_MAIL;
    const mailHost = process.env.MAIL_HOST;
    const mailPort = process.env.MAIL_PORT;
    // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
      auth: {
        user: process.env.USER_MAIL_KEY,
        pass: process.env.PRIVATE_KEY_MAIL,
      }
    });
    const options = {
      from: adminEmail, // địa chỉ admin email bạn dùng để gửi
      to: toEmail, // địa chỉ gửi đến
      subject: subject, // Tiêu đề của mail
      template: template,
      context: context// mail template
    }
    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: 'src/mail-templates',
          layoutsDir: process.cwd() + `/src/mail-templates/${dir}`,
          defaultLayout: template,
        },
        viewPath: 'src/mail-templates/' + dir,
        extName: '.hbs',
      }),
    );
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options);
  }
}
