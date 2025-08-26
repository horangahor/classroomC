const nodemailer = require("nodemailer");
const dotenv = require("dotenv"); // 숨겨진 환경변수 파일에서 값을 가져와 파싱(구문분석)을 할 수 있게 만드는 모듈
dotenv.config();
const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;

// 난수 code 생성하는 함수
const generateRandomNumber = (n) => {
  console.log(NODEMAILER_PASS);
  
  let code = "";
  for (let i = 0; i < n; i++) {
    code += Math.floor(Math.random() * 10);
  }
  console.log("난수 만들기의", code);
  
  return code;
};

// 메일의 기본적 속성을 정의 ??
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

const sendEmail = (email, code) => {
  console.log("sendEmail의", code);
  const verificationUrl = `http://localhost:8000/confirm?token=${code}`;
  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject: "Co-Code 회원가입 인증 코드", // 메일제목
    html: `<h1>Co-Code 회원가입 인증 코드:</h1>
           <a href="${verificationUrl}">인증하기</a>`, // 메일 내용
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  return code;
};

module.exports = { generateRandomNumber, sendEmail };