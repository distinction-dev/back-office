import AWS from "aws-sdk";
import env from "@lib/env";
import { promises as fsPromises } from "fs";

const region = process.env.AWS_REGION || "ap-south-1";

const ses = new AWS.SES({ region });

const SES_EMAIL_SENDER = "jay@distinction.dev";

// eslint-disable-next-line max-len
export const SES_ARN = `arn:aws:ses:${region}:${env.AWS_ACCOUNT_ID}:identity/${SES_EMAIL_SENDER}`;

export const sendEmailWithAttachment = async (
  destination: string,
  filePath: string,
  subject: string,
  bodyText: string
): Promise<boolean> => {
  const attachmentFileName: string = filePath.split("/").pop()!;

  try {
    // Read the file content
    const attachmentContent: Buffer = await fsPromises.readFile(filePath);

    // Encode the file content to base64
    const base64Data: string = attachmentContent.toString("base64");

    // Create the email params
    const params: AWS.SES.SendRawEmailRequest = {
      Source: SES_EMAIL_SENDER,
      Destinations: [destination],
      RawMessage: {
        // eslint-disable-next-line max-len
        Data: `From: ${SES_EMAIL_SENDER}\nTo: ${destination}\nSubject: ${subject}\nMIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="aRandomBoundaryString"\n\n--aRandomBoundaryString\nContent-Type: text/plain; charset=us-ascii\n\n${bodyText}\n\n--aRandomBoundaryString\nContent-Type: text/csv\nContent-Disposition: attachment; filename="${attachmentFileName}"\nContent-Transfer-Encoding: base64\n\n${base64Data}\n\n--aRandomBoundaryString--`,
      },
    };

    // Send the raw email with attachment
    await ses.sendRawEmail(params).promise();
    console.log("Email sent!");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
