import { extendTheme } from "@chakra-ui/react";

const base3DShadow = (depth, color, activeDepth) => ({
    boxShadow: `0px ${depth}px 0px 0px var(--chakra-colors-${color}-700)`,
    transition: 'all 0.1s ease-out',
    _active: {
        transform: `translateY(${depth - activeDepth}px)`,
        boxShadow: `0px ${activeDepth}px 0px 0px var(--chakra-colors-${color}-700)`,
        marginTop: '0px',
    },
});

const theme = extendTheme({

    fonts: {
        heading: `"Montserrat", sans-serif`,
        body: `Roboto, sans-serif`,
    },

    styles: {
        global: {
            body: {
                bg: "#F0DCC9",
            },
        },
    },

    colors: {
        primary: {
            50: "#e0f6ef",
            100: "#b3e9d4",
            200: "#80dcb9",
            300: "#4cd09e",
            400: "#22bb81",
            500: "#02A05C",
            600: "#029053",
            700: "#027e49",
            800: "#016038",
            900: "#014126",
            1000: "#012114ff",
        },
        yellow: { 50: "#E9A300" },
        orange: { 
            50: "#DA5700",
            100: "#f9a66f",
            200: "#6e2c00",
        },
        blue: {
            50: "#353887",
            100: "#8c8ec6",
        },
        violet: {
            50: "#A803A8",
            100: "#c07fc0",
            200: "#440044",
        },
        red: { 
            50: "#920B0B",
            100: "#623e3e",
        },
    },

    components: {
        Button: {
            variants: {
                solid3D: (props) => ({
                    ...base3DShadow(7, 'primary', 4),
                    colorScheme: 'primary',
                    color: "#F0DCC9",
                    borderRadius: 'xl',
                    fontSize: 'xl',
                    padding: '25px',
                    bg: `${props.colorScheme}.500`,
                    _hover: {
                        color: "#F0DCC9",
                        bg: `${props.colorScheme}.600`,
                        boxShadow: `0px 7px 0px 0px var(--chakra-colors-${props.colorScheme}-900)`,
                    }
                }),

                outline3D: (props) => ({
                    ...base3DShadow(4, 'primary', 2),
                    borderRadius: 'md',
                    bg: '#920B0B',
                    borderColor: `${props.colorScheme}.500`,
                    borderWidth: '1px',
                    _hover: {
                        color: "#F0DCC9",
                        bg: 'primary.50',
                        boxShadow: `0px 4px 0px 0px var(--chakra-colors-${props.colorScheme}-1000)`,
                    }
                }),
            },
        },
    },
});

export default theme;