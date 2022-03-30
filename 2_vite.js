import { setDefaultDefaultExport } from "../../ast-tools.js";
import { findOrAddImportFn, getVitePluginsArray } from "./ast.js";

/**
 * @param {import("./ast").FindOrAddImportFn} findOrAddImport
 * @param {import("estree").ArrayExpression} vitePluginsArray */
const addUnocssPlugin = (findOrAddImport, vitePluginsArray) => {
	const unocssViteImporedAs = findOrAddImport({ package: "unocss/vite", as: "default:unocss" });

	const unocssConfigImporedAs = findOrAddImport({ package: "./unocss.config", ext: true, as: "default:unocssConfig" });

	/** @type {import("estree").CallExpression | undefined} */
	let unocssFunctionCall;
	for (const element of vitePluginsArray.elements) {
		if (!element) continue;
		if (element.type !== "CallExpression") continue;
		if (element.callee.type !== "Identifier") continue;
		if (element.callee.name !== unocssViteImporedAs) continue;
		unocssFunctionCall = element;
	}

	if (!unocssFunctionCall) {
		unocssFunctionCall = {
			type: "CallExpression",
			arguments: [
				{
					type: "Identifier",
					name: unocssConfigImporedAs,
				},
			],
			callee: {
				type: "Identifier",
				name: unocssViteImporedAs,
			},
			optional: false,
		};

		vitePluginsArray.elements.unshift(unocssFunctionCall);
	}
};

/**
 * @param {import("../../ast-io.js").RecastAST} svelteConfigAst
 * @param {boolean} cjs
 * @returns {import("../../ast-io.js").RecastAST}
 */
const updateSvelteConfig = (svelteConfigAst, cjs) => {
	const findOrAddImport = findOrAddImportFn(svelteConfigAst, cjs);

	const svelteConfigObject = setDefaultDefaultExport({
		cjs,
		defaultValue: {
			type: "ObjectExpression",
			properties: [],
		},
		typeScriptEstree: svelteConfigAst,
	});
	if (svelteConfigObject.type !== "ObjectExpression") throw new Error("Svelte config must be an object");

	const vitePluginsArray = getVitePluginsArray({ configObject: svelteConfigObject });
	if (typeof vitePluginsArray.elements === "undefined") throw new TypeError("expected kit.vite.plugins array configuration in Svelte config");

	addUnocssPlugin(findOrAddImport, vitePluginsArray);

	return svelteConfigAst;
};

/**
 * @param {import("../../ast-io.js").RecastAST} viteConfigAst
 * @param {boolean} cjs
 * @returns {import("../../ast-io.js").RecastAST}
 */
const updateViteConfig = (viteConfigAst, cjs) => {
	const findOrAddImport = findOrAddImportFn(viteConfigAst, cjs);

	const viteConfigObjectOrCall = setDefaultDefaultExport({
		cjs: false,
		defaultValue: {
			type: "ObjectExpression",
			properties: [],
		},
		typeScriptEstree: viteConfigAst,
	});

	/** @type {import("estree").ObjectExpression | undefined} */
	let viteConfigObject;
	if (viteConfigObjectOrCall.type === "ObjectExpression") {
		viteConfigObject = viteConfigObjectOrCall;
	} else if (viteConfigObjectOrCall.type === "CallExpression") {
		const configObject = viteConfigObjectOrCall.arguments[0];
		if (configObject.type !== "ObjectExpression") throw new Error("argument passed to vite defineConfig needs to be an object");
		viteConfigObject = configObject;
	} else {
		throw new Error("vite config needs to be an object or defineConfig called on an object");
	}

	let vitePluginsArray = getVitePluginsArray({ configObject: viteConfigObject }, true);
	if (typeof vitePluginsArray.elements === "undefined") throw new TypeError("expected kit.vite.plugins array configuration in Svelte config");

	addUnocssPlugin(findOrAddImport, vitePluginsArray);

	return viteConfigAst;
};

/**
 * @param {import("../..").AdderRunArg<import("./__info.js").Options>} param0
 * @returns {Promise<void>}
 */
export const updateViteJavaScript = async ({ updateJavaScript, folderInfo }) => {
	const cjs = folderInfo.packageType !== "module";

	if (folderInfo.kit && "@sveltejs/kit" in folderInfo.allDependencies) {
		const svelteConfigPath = cjs ? "/svelte.config.cjs" : "/svelte.config.js";

		await updateJavaScript({
			path: svelteConfigPath,

			async script({ typeScriptEstree }) {
				return {
					typeScriptEstree: updateSvelteConfig(typeScriptEstree, cjs),
				};
			},
		});
	} else {
		const viteConfigPath = cjs ? "/vite.config.cjs" : "/vite.config.js";

		await updateJavaScript({
			path: viteConfigPath,

			async script({ typeScriptEstree }) {
				return {
					typeScriptEstree: updateViteConfig(typeScriptEstree, cjs),
				};
			},
		});
	}
};
