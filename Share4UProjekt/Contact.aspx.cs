using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Net;
using Facebook;
using Share4UProjekt.Model.DataBase;
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;
using Share4UProjekt.Model.DataBase;
using System.Net.Mail;

namespace Share4UProjekt
{
    public partial class Contact : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void SendEmail(object sender, EventArgs e)
        {

            using (MailMessage mm = new MailMessage(txtEmail.Text, txtTo.Text))
            {
                mm.Subject = txtSubject.Text;
                mm.Body = txtBody.Text;
                if (fuAttachment.HasFile)
                {
                    string FileName = Path.GetFileName(fuAttachment.PostedFile.FileName);
                    mm.Attachments.Add(new Attachment(fuAttachment.PostedFile.InputStream, FileName));
                }
                mm.IsBodyHtml = false;
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                NetworkCredential NetworkCred = new NetworkCredential(txtEmail.Text, txtPassword.Text);
                smtp.UseDefaultCredentials = true;
                smtp.Credentials = NetworkCred;
                smtp.Port = 587;
                smtp.Send(mm);
                ClientScript.RegisterStartupScript(GetType(), "alert", "alert('Tack för ditt meddlande!.');", true);
            }
        }
    }
}


