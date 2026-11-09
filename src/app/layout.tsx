import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-TripHub | 국내 여행사 & 관광객 연결 플랫폼",
  description: "한국의 숨은 명소를 전문 여행사와 함께! 내국인과 방한 외국인을 위한 최고의 국내 여행 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
