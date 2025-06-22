import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    fonts: {
        heading: `"Comfortaa", sans-serif`,
        body: `"Comfortaa", sans-serif`,
    },
    styles: {
        global: {
            body: {
                bg: "#ecead4",
                color: "gray.800",
            },
        },
    },
    colors: {
        primary: {
            50: "#e1f2ef",
            100: "#b3ddd7",
            200: "#80c7bc",
            300: "#4db0a0",
            400: "#269183",
            500: "#01473D",
            600: "#013e36",
            700: "#01342f",
            800: "#012b27",
            900: "#011d1a",
        },
        secondary: {
            50: "#ffffff",
            100: "#f9f9f6",
            200: "#f4f3ec",
            300: "#efeee3",
            400: "#eae9da",
            500: "#ECEAD4",
            600: "#d5d3bf",
            700: "#bebca9",
            800: "#a7a593",
            900: "#918f7e",
        },
    },
});

export default theme;