import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AKAAR 3D",
    short_name: "AKAAR",
    description: "3D printing studio in Jaipur. Upload your file, get a quote in 48 hours.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/logo.jpeg", sizes: "512x512", type: "image/jpeg" },
    ],
  };
}
