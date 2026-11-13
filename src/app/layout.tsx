import "./globals.css";
import { App, ConfigProvider } from "antd";
import { THEME_CONFIG } from "./theme";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ConfigProvider theme={THEME_CONFIG}>
      <App>
        <html lang="en" className="h-full antialiased">
          <body className="min-h-full flex flex-col">{children}</body>
        </html>
      </App>
    </ConfigProvider>
  );
}
