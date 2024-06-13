import React from "react";
import Weather from "./component/Weather";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Weather />
      </div>
    </ThemeProvider>
  );
};

export default App;
