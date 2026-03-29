"use client"

import { App, ConfigProvider } from "antd";
import "./globals.css";
import { antdConfig } from "@/theme"



interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <ConfigProvider theme={antdConfig}>
      <App>
        <html lang="en" className="min-h-full">
          <body className="min-h-full flex flex-col">
            {children}
          </body>
        </html>
      </App>
    </ConfigProvider>
  );
}
