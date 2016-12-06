using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(EcanPropertyApp.Startup))]

namespace EcanPropertyApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {}
    }
}
