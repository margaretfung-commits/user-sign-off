const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

/* -----------------------------
   1. EMAIL TRANSPORTER (PUT HERE)
------------------------------*/
const transporter = nodemailer.createTransport({
    host: "zmail.shoalter.com.tw",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* -----------------------------
   2. JIRA WEBHOOK ENDPOINT
------------------------------*/
app.post("/jira/approval-email", async (req, res) => {
    try {
        const { ticketKey, summary, requester } = req.body;

        const development = 3;
        const qa = development * 0.45;
        const pm = development * 0.45;

        const emailSubject = `Ticket Request - ${ticketKey} ${summary}`;

        const emailBody = `
Dear ${requester},

Could you please help to confirm the requirements for the below enhancement? For further details, kindly refer to the attached JIRA document. Thank you.

Topic: [SAP] Add new and fix missing fields in approval & reminder emails

Requirement:
Add new and fix missing fields in approval and reminder emails

Estimated Effort:
Development: ${development} man-days
QA: ${qa} man-days
PM: ${pm} man-days

Please let us know if the above requirement aligns with your expectation or if any adjustments are needed.

Thank you.
        `;

        // SMTP setup (example)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: "margaret.fung@shoalter.com",
            to: requester,
            cc: "margaret.fung@shoalter.com",
            subject: emailSubject,
            text: emailBody
        });

        res.status(200).send("Email sent");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed");
    }
});

app.listen(3000, () => console.log("Running on port 3000"));
