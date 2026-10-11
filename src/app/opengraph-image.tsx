// VEL-WEB-landing AC-18: 1200×630 share image with the headline.
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = "Connect messy data. See how it fits. Send it clean anywhere.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f5f6f3",
          color: "#16201c",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700 }}>{site.name}</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>{alt}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#525e58" }}>
          <div style={{ width: 120, height: 6, background: "#1c7347" }} />
          Spreadsheets, databases and APIs in. Clean, linked data out.
        </div>
      </div>
    ),
    size,
  );
}
