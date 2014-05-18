using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Membership.OpenAuth;
using ASPSnippets.FaceBookAPI;

namespace Share4UProjekt
{
    internal static class AuthConfig
    {
        /// <summary>
        /// Metod innehållande applikation id och hemligt id.
        /// </summary>
        public static void RegisterOpenAuth()
        {
            FaceBookConnect.API_Key = "1407528266185362";
            FaceBookConnect.API_Secret = "92b721aae97f93c6b434ce01ce299c97";
        }
    }
}