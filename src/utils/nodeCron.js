const corn = require("node-cron");
const { transporter } = require("./sendEmail");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const yesterday = subDays(new Date(), 1);
const yesterdayStart = startOfDay(yesterday);
const yesterdayEnd = endOfDay(yesterday);
corn.schedule("0 8 * * *",async()=>{
   try{
     const connections = await ConnectionRequestModel.find({status:"interested",createdAt:{
        $gte:yesterdayStart,
        $lt:yesterdayEnd
     }}).populate("fromUserId toUserId")
     const listOfEmails = [...new Set(connections.map(req=>req.toUserId.emailId))]
     console.log(listOfEmails)
     for(const email of listOfEmails)
     {
            try{
                let infoObj = {
                    from: "kusumasaketh92@gmail.com",
                    to: [email],
                    subject: "New request pending in Dev Tinder",
                    text: "There are many friend requests pending please login to the portal ", // plain‑text body
                    html: `
                    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Message Notification</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f9fc;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.05);overflow:hidden;">
            <tr>
              <td align="center" style="background:#4f46e5;color:#fff;padding:16px 0;font-size:20px;font-weight:bold;">
                Portal Notification
              </td>
            </tr>
            <tr>
              <td style="padding:24px;text-align:left;color:#1f2937;">
                <p style="margin:0 0 16px 0;font-size:16px;">
                  Hi ${email},
                </p>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;">
                  You’ve received a new message regarding your recent request.
                  Please visit the portal to check the details.
                </p>
                <div style="text-align:center;margin-top:24px;">
                  <a href="http://3.104.109.135/" style="background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;display:inline-block;">
                    Go to Portal
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px;text-align:center;font-size:13px;color:#9ca3af;background:#f9fafb;">
                © ${new Date().getFullYear()} Dev Tinder • <a href="http://3.104.109.135/" style="color:#4f46e5;text-decoration:none;">Visit Portal</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

                    `, // HTML body
                };
                await transporter.sendMail(infoObj)

            }
            catch(err){
                console.error(err.message)
            }
     }
   } 
   catch(err)
   {
        console.error(err.message)
   }
})
