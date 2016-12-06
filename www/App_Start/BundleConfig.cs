using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace EcanPropertyApp
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterCssBundles(bundles);
            RegisterJavascriptBundles(bundles);

#if DEBUG && !TEST_BUNDLING
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true;
#endif
        }

        private static void RegisterCssBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/content/css")
                .Include(
                    "~/Content/application.css",
                    "~/libs/angular-material/angular-material.css",
                    "~/libs/angular-block-ui/angular-block-ui.css"
                ));


        }

        private static void RegisterJavascriptBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include("~/libs/angular/angular.js")
                .Include("~/libs/angular-sanitize/angular-sanitize.js")
                .Include("~/libs/angular-ui-router/angular-ui-router.js")
                .Include("~/libs/angular-bootstrap/ui-bootstrap-tpls.js")
                .Include("~/libs/angular-strap/angular-strap.js")
                .Include("~/libs/angular-strap/angular-strap.tpls.js")
                .Include("~/libs/angular-aria/angular-aria.js")
                .Include("~/libs/angular-animate/angular-animate.js")
                .Include("~/libs/angular-material/angular-material.js")
                .Include("~/libs/clipboard/clipboard.js")
                .Include("~/libs/ngclipboard/ngclipboard.js")
                .Include("~/libs/angular-block-ui/angular-block-ui.js")
                .Include("~/libs/angular-socialshare/angular-socialshare.min.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/libs")
                .Include("~/libs/lodash/lodash.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/app")
                .IncludeDirectory("~/App", "*.module.js", true)
                .IncludeDirectory("~/App", "*.js", true));
        }
    }
}
