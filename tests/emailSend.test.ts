import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "...",
    pass: "...",
  },
});

const options = {
  from: "...",
  to: "...",
  subject: "sus",
  text: "bruh",
};

transporter.sendMail(options, (err: any, info: any) => {
  if (err) {
    console.log(err);
  }

  console.log(info.response);
});
