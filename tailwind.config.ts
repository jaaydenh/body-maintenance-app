import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },
            colors: {
                'purple': '#2e026d',
            },
        },
    },
    plugins: [],
} satisfies Config;
