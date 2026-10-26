import "./globals.css";
import { App, ConfigProvider, theme } from "antd";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App>
        <html lang="en" className="h-full antialiased">
          <body className="min-h-full flex flex-col">{children}</body>
        </html>
      </App>
    </ConfigProvider>
  );
}
