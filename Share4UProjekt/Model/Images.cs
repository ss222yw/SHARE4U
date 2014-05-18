using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model
{
    public class Images
    {
        public int ImgID { get; set; }
        public int views { get; set; }
        public string ImgName { get; set; }
        public string userid { get; set; }
        public int KategoriID { get; set; }
        [Required(ErrorMessage = "Rubriken måste anges.")]
        [StringLength(255, ErrorMessage = "Rubriken kan bestå av som mest 255 tecken.")]
        public string Title { get; set; }
        public DateTime dateOfTheDay { get; set; }
    }
}