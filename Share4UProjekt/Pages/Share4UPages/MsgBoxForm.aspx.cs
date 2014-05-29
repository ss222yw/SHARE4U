using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Net;
using Facebook;
using Share4UProjekt.Model.DAL;
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;
using System.Net.Mail;
namespace Share4UProjekt.Pages.Share4UPages
{
    public partial class MsgBoxForm : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void SendEmail(object sender, EventArgs e)
        {
            if (IsValid)
            {
                //Tagit delvis kod från aspsnippet.
                using (MailMessage mm = new MailMessage(txtEmail.Text, txtTo.Text))
                {
                    try
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
                        ClientScript.RegisterStartupScript(GetType(), "alert", "alert('Vi har tagit emot ditt meddlande och svarar så snart som möjligt. Tack för att du kontaktat oss!.');", true);
                    }
                    catch (Exception)
                    {
                        ClientScript.RegisterStartupScript(GetType(), "alert", "alert('Fel Lösen ord eller e-post!.');", true);
                    }
                }

            }
        }
    }
}