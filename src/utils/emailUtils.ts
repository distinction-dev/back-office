import aws from "aws-sdk";
import env from "@lib/env";
import constant from "./constant";
import * as nodemailer from "nodemailer";
import * as handlebars from "express-handlebars";
import hbs from "nodemailer-express-handlebars";
import { readFile } from "fs/promises";

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: process.env.AWS_REGION || "ap-south-1",
  ...(env.STAGE === "local" && {
    endpoint: new aws.Endpoint(
      `email-smtp.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com`
    ),
  }),
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

const templateName = constant.EMAIL_TEMPLATE.SEND_DOCUMENT;

const viewEngine = handlebars.create({
  partialsDir: constant.TEMPLATES_DIRECTORY,
  defaultLayout: false,
});

const hbsOptions = {
  viewEngine,
  viewPath: constant.TEMPLATES_DIRECTORY,
  extName: ".template",
};
transporter.use("compile", hbs(hbsOptions));

const fileName = "output.csv";

export const sendEmail = async (fromAddress: string, toAddress: string) => {
  try {
    const mailParams = {
      from: fromAddress,
      to: toAddress,
      subject: "Shared Document",
      template: templateName,
      context: {},
      attachments: [
        {
          filename: fileName,
          contentType: "application/csv",
          content: await readFile(`${constant.TEMP_PATH}/${fileName}`),
          context: {
            user: {
              firstName: "Hello",
              lastName: "DDev",
            },
          },
        },
      ],
    };

    await transporter.sendMail(mailParams);
  } catch (error) {
    console.log("Error in Sending Email", error);
  }
};
