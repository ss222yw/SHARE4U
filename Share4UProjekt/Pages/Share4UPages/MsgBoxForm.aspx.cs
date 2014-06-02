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
        private string Message
        {
            get
            {
                return Session["Message"] as string;
            }
            set
            {
                Session["Message"] = value;
            }
        }
        protected void closeImg_Click(object sender, ImageClickEventArgs e)
        {
            ResponsePanel.Visible = true;
            var close = Request.QueryString["Message"];
            Response.RedirectToRoute("Msg", close);
        }
        protected void Page_Load(object sender, EventArgs e)
        {

            if (Message != null)
            {
                ResponsePanel.Visible = true;
                SuccessTest.Visible = true;
                SuccessTest.Text = Message;
                Session.Remove("Message");
            }
        }
        //Tagit denna delen från http://www.aspsnippets.com/Articles/Show-Hide-Password-in-Password-TextBox-with-CheckBox-using-jQuery.aspx
        protected void Button1_Click(object sender, EventArgs e)
        {
            string password = Request.Form[txtPassword.UniqueID];
            ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('" + password + "');", true);
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
                        bool boss = true;
                        if (fuAttachment.HasFile)
                        {
                            if ((fuAttachment.PostedFile.ContentType == "image/png") ||
                                   (fuAttachment.PostedFile.ContentType == "image/jpeg") ||
                                  (fuAttachment.PostedFile.ContentType == "image/jpg") ||
                                   (fuAttachment.PostedFile.ContentType == "image/gif"))
                            {
                                string FileName = Path.GetFileName(fuAttachment.PostedFile.FileName);
                                mm.Attachments.Add(new Attachment(fuAttachment.PostedFile.InputStream, FileName));
                            }
                            else
                            {
                                Label1.Visible = true;
                                Label1.Text = "Filen måste vara av image format(png, jpeg, jpg eller gif).";
                                boss = false;
                            }
                        }


                        if (boss == true)
                        {
                            mm.IsBodyHtml = false;
                            SmtpClient smtp = new SmtpClient();
                            smtp.Host = "smtp.gmail.com";
                            smtp.EnableSsl = true;
                            NetworkCredential NetworkCred = new NetworkCredential(txtEmail.Text, txtPassword.Text);
                            smtp.UseDefaultCredentials = true;
                            smtp.Credentials = NetworkCred;
                            smtp.Port = 587;
                            smtp.Send(mm);
                            Message = "Vi har tagit emot ditt meddelande och svarar så snart som möjligt. Tack för att du kontaktat oss!.";
                            Response.RedirectToRoute("Msg");
                        }
                    }
                    catch (Exception)
                    {
                        Label1.Visible = true;
                        Label1.Text = "Fel Lösenord eller e-post!Försök igen";
                    }
                }

            }
        }
    }
}