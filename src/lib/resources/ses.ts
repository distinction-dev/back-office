import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { promises as fsPromises } from "fs";

import env from "@lib/env";

const ses = new SESClient({ region: process.env.AWS_REGION || "ap-south-1" });

const SES_EMAIL_SENDER = "jay@distinction.dev";

// eslint-disable-next-line max-len
export const SES_ARN = `arn:aws:ses:ap-south-1:${env.AWS_ACCOUNT_ID}:identity/${SES_EMAIL_SENDER}`;

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
    // eslint-disable-next-line max-len
    const messageData = `From: ${SES_EMAIL_SENDER}\nTo: ${destination}\nSubject: ${subject}\nMIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="aRandomBoundaryString"\n\n--aRandomBoundaryString\nContent-Type: text/plain; charset=us-ascii\n\n${bodyText}\n\n--aRandomBoundaryString\nContent-Type: text/csv\nContent-Disposition: attachment; filename="${attachmentFileName}"\nContent-Transfer-Encoding: base64\n\n${base64Data}\n\n--aRandomBoundaryString--`;

    // Convert the message data to a Uint8Array
    const messageDataUint8 = new TextEncoder().encode(messageData);

    // Create the email params with Uint8Array data
    const params = {
      Source: SES_EMAIL_SENDER,
      Destinations: [destination],
      RawMessage: {
        Data: messageDataUint8,
      },
    };

    // Send the raw email with attachment
    await ses.send(new SendRawEmailCommand(params));
    console.log("Email sent!");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
