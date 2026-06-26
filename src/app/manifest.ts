import { MetadataRoute } from "next";

const ICON_URL = "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054380/logo_Kampus_Filter_Png_ltv2j8.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kampus Filter",
    short_name: "KampusFilter",
    description: "Discover opportunities, career intelligence, scholarships, internships, and education insights.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14213d",
    icons: [
      {
        src: ICON_URL,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: ICON_URL,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

