import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#b71c1c',
    },
  },
});

// Make the theme responsive
// theme = responsiveFontSizes(theme, {
//   breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
//   disableAlign: true, // optional
// });

export { theme };
