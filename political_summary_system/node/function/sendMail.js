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

// 회원가입 인증용 메일
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



// 비밀번호 리셋용 메일
const sendPwMail = (email,code) => {
  const verificationUrl = `http://localhost:5173/resetPw?token=${code}`; // 이걸 비밀번호 변경할 수 있도록 바꿔야할 듯, 프론트 입력창으로
  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject: "Co-Code 비밀번호 변경", // 메일제목
    html: `<h1>Co-Code 비밀번호 변경하기:</h1>
           <a href="${verificationUrl}">변경하기</a>`, // 메일 내용
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

module.exports = { generateRandomNumber, sendEmail, sendPwMail };