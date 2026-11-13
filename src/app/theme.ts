import type { ThemeConfig } from "antd";
import { theme } from "antd";

const COLORS = {
  bg_primary: "#151b27",
} as const;

export const THEME_CONFIG = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorText: "#FFFF",
    colorBgBase: COLORS.bg_primary,
    colorBgContainer: COLORS.bg_primary,
    colorBgElevated: COLORS.bg_primary,
  },
} as const satisfies ThemeConfig;
