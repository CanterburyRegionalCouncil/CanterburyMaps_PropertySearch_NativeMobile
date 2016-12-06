using System.Web.Mvc;
using System.Web.Routing;

namespace EcanPropertyApp
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "EntryPoint", action = "App", id = UrlParameter.Optional }
            );
        }
    }
}
