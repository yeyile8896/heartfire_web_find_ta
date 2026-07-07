import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPagePath, sectionViews, type SiteView } from "@/lib/site-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const views: SiteView[] = ["home", ...sectionViews];

  return views.flatMap((view) => {
    const zhUrl = `${SITE_URL}${getPagePath("zh", view)}`;
    const enUrl = `${SITE_URL}${getPagePath("en", view)}`;

    return [
      {
        url: zhUrl,
        lastModified: new Date(),
        alternates: {
          languages: {
            "zh-CN": zhUrl,
            "en-US": enUrl
          }
        }
      },
      {
        url: enUrl,
        lastModified: new Date(),
        alternates: {
          languages: {
            "zh-CN": zhUrl,
            "en-US": enUrl
          }
        }
      }
    ];
  });
}
