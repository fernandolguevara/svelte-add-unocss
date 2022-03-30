export const name = "unocss";

export const emoji = "1️⃣";

export const usageMarkdown = ["You can use unocss utility classes like `bg-blue-700` in the markup (components, routes, `app.html`).", "You need to import unocss in your [page|component|__layout].svelte file ```import 'uno.css';```"];

/** @type {import("../..").Gatekeep} */
export const gatekeep = async () => {
	return { able: true };
};

/**
 * @typedef {{
 *  uno: boolean
 *  mini: boolean
 *  windi: boolean
 *  attributify: boolean
 *  icons: boolean
 *  webfonts: boolean
 *  typography: boolean
 *  scapel: boolean
 *  chroma: boolean
 *  scrollbar: boolean
 * }} Options
 */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {
	uno: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-attributify",
		default: true,
		descriptionMarkdown: "whether or not to set up the [attributify-preset](https://github.com/unocss/unocss/tree/main/packages/preset-attributify).",
		question: "Do you want to use the unocss attributify preset?",
	},
	mini: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-mini",
		default: false,
		descriptionMarkdown: "whether or not to set up the [mini-preset](https://github.com/unocss/unocss/tree/main/packages/preset-mini).",
		question: "Do you want to use the unocss mini preset?",
	},
	windi: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-windi",
		default: false,
		descriptionMarkdown: "whether or not to set up the [windi-preset](https://github.com/unocss/unocss/tree/main/packages/preset-windi).",
		question: "Do you want to use the unocss windi preset?",
	},
	attributify: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-attributify",
		default: false,
		descriptionMarkdown: "whether or not to set up the [attributify-preset](https://github.com/unocss/unocss/tree/main/packages/preset-attributify).",
		question: "Do you want to use the unocss scrollbar preset?",
	},
	icons: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-icons",
		default: false,
		descriptionMarkdown: "whether or not to set up the [icons-preset](https://github.com/unocss/unocss/tree/main/packages/preset-icons).",
		question: "Do you want to use the unocss icons preset?",
	},
	webfonts: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-web-fonts",
		default: false,
		descriptionMarkdown: "whether or not to set up the [web-fonts-preset](https://github.com/unocss/unocss/tree/main/packages/preset-web-fonts).",
		question: "Do you want to use the unocss web fonts preset?",
	},
	typography: {
		context: "https://github.com/unocss/unocss/tree/main/packages/preset-typography",
		default: false,
		descriptionMarkdown: "whether or not to set up the [typography-preset](https://github.com/unocss/unocss/tree/main/packages/preset-typography).",
		question: "Do you want to use the unocss typography preset?",
	},
	scapel: {
		context: "https://github.com/macheteHot/unocss-preset-scalpel",
		default: false,
		descriptionMarkdown: "whether or not to install and set up the [unocss-preset-scalpel](https://github.com/macheteHot/unocss-preset-scalpel).",
		question: "Do you want to use the unocss scapel preset?",
	},
	chroma: {
		context: "https://github.com/chu121su12/unocss-preset-chroma",
		default: false,
		descriptionMarkdown: "whether or not to install and set up the [unocss-preset-chroma](https://github.com/chu121su12/unocss-preset-chroma).",
		question: "Do you want to use the unocss chroma preset?",
	},
	scrollbar: {
		context: "https://github.com/action-hong/unocss-preset-scrollbar",
		default: false,
		descriptionMarkdown: "whether or not to install and set up the [unocss-preset-scrollbar](https://github.com/action-hong/unocss-preset-scrollbar).",
		question: "Do you want to use the unocss scrollbar preset?",
	},
};

/** @type {import("../..").Heuristic[]} */
export const heuristics = [
	{
		description: "`unocss` is installed",
		async detector({ folderInfo }) {
			return "unocss" in folderInfo.allDependencies;
		},
	},
	{
		description: "`vite.config` or `svelte.config` has `unocss` as a vite plugin",
		async detector({ readFile }) {
			let { text: viteText, exists: viteExists } = await readFile({ path: "/vite.config.js" });

			if (!viteExists) {
				let { text, exists } = await readFile({ path: "/vite.config.cjs" });
				viteText = text;
				viteExists = exists;
			}

			if (viteExists) {
				return viteText.includes("unocss/vite");
			}

			const { text } = await readFile({ path: "/svelte.config.js" });

			return text.includes("unocss/vite");
		},
	},
	{
		description: "`uno.config` file exists",
		async detector({ readFile }) {
			const cjs = await readFile({ path: "/unocss.config.cjs" });
			const js = await readFile({ path: "/unocss.config.js" });

			return cjs.exists || js.exists;
		},
	},
];
