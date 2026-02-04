import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/upload",
          "/processing",
          "/result",
          "/adjust",
          "/adjustment-result",
          "/customer-info",
          "/pix",
          "/payment-confirmed",
          "/refund",
          "/refund-confirmed",
          "/dashboard",
          "/login",
          "/start",
          "/error",
        ],
      },
    ],
    sitemap: "https://genea.cc/sitemap.xml",
  };
}
