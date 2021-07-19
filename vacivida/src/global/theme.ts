import { configureFonts, DefaultTheme } from "react-native-paper";
import fontConfig from "./font";

const theme = {
  ...DefaultTheme,
  fonts: configureFonts({ default: fontConfig}),
  colors: {
    ...DefaultTheme.colors,
    fields: {
      label: '#9C98A6',
      border: '#E6E6F0',
      background: '#FAFAFC'
    },
    accent: '#02C532',
    basic: '#C4C4C4',
    disabled: '#DCDCE5'
  }
};

export default theme;
