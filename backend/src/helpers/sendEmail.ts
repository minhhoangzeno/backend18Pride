import nodemailer = require("nodemailer");
import { emailConfig } from "src/constant";

export const sendEmailRegister = (name: string, email: string, confirmationCode: string) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    }
  })
  transport.sendMail({
    from: emailConfig.user,
    to: email,
    subject: "Vui lòng xác nhận tài khoản của bạn",
    html: `<h1>Email xác nhận</h1>
        <h2>Xin chào ${name}</h2>
        <p>Cảm ơn bạn đã đăng ký. Vui lòng xác nhận tài khoản bằng cách nhấn vào đường link dưới đây</p>
        <img src="https://www.toponseek.com/blogs/wp-content/uploads/2019/06/toi-uu-hinh-anh-optimize-image.jpg" alt="anh" >
        <a href=http://localhost:3002/verify-email/${confirmationCode}>Link</a>
        </div>`,
  }).catch(err => console.log(err));
}

export const sendEmailForgotPassword = (name: string, email: string, confirmationCode: string) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    }
  })
  transport.sendMail({
    from: 'noreply18PRIDE@gmail.com',
    to: email,
    subject: "Quên mật khẩu",
    html: `<h1>Xác nhận mật khẩu mới</h1>
        <h2>Xin chào ${name}</h2>
        <p>Vui lòng nhấn vào đường link dưới đây để tạo mật khẩu mới!</p>
        <img src="https://www.toponseek.com/blogs/wp-content/uploads/2019/06/toi-uu-hinh-anh-optimize-image.jpg" alt="anh" >
        <a href=http://localhost:3002/reset-password/${confirmationCode}>Link</a>
        </div>`,
  }).catch(err => console.log(err));
}