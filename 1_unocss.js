import { setDefaultDefaultExport, setDefault } from "../../ast-tools.js";
import { findOrAddImportFn } from "./ast.js";

/**
 * @param {import("../../ast-io.js").RecastAST} unocssConfigAst
 * @param {import("./__info.js").Options}  options
 *  * @param {boolean}  cjs
 * @returns {import("../../ast-io.js").RecastAST}
 */
const updateUnocssConfig = (unocssConfigAst, options, cjs) => {
	const findOrAddImport = findOrAddImportFn(unocssConfigAst, cjs);

	const configObject = setDefaultDefaultExport({
		cjs,
		defaultValue: {
			type: "ObjectExpression",
			properties: [],
		},
		typeScriptEstree: unocssConfigAst,
	});

	if (configObject.type !== "ObjectExpression") throw new Error("unocss config must be an object");

	const extractorSvelteImportedAs = findOrAddImport({ package: "unocss", as: "extractorSvelte" });

	setDefault({
		default: /** @type {import("estree").ArrayExpression} */ ({
			type: "ArrayExpression",
			elements: [
				{
					type: "Identifier",
					name: extractorSvelteImportedAs,
				},
			],
		}),
		object: configObject,
		property: "extractors",
	});

	/** @type {import("estree").ArrayExpression} */
	const emptyPresets = {
		type: "ArrayExpression",
		elements: [],
	};

	const presetsList = setDefault({
		default: emptyPresets,
		object: configObject,
		property: "presets",
	});

	if (presetsList.type !== "ArrayExpression") throw new Error("`presets` in unocss config must be an array");

	if (options.attributify) {
		const presetAttributifyImportedAs = findOrAddImport({ package: "@unocss/preset-attributify", as: "default:presetAttributify" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetAttributifyImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.mini) {
		const presetMiniImportedAs = findOrAddImport({ package: "@unocss/preset-mini", as: "default:presetMini" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetMiniImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.windi) {
		const presetWindImportedAs = findOrAddImport({ package: "@unocss/preset-wind", as: "default:presetWind" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetWindImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.uno) {
		const presetUnoImportedAs = findOrAddImport({ package: "@unocss/preset-uno", as: "default:presetUno" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetUnoImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.typography) {
		const presetTypographyImportedAs = findOrAddImport({ package: "@unocss/preset-typography", as: "presetTypography" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetTypographyImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.icons) {
		const presetIconsImportedAs = findOrAddImport({ package: "@unocss/preset-icons", as: "default:presetIcons" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetIconsImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.webfonts) {
		const presetWebFontsImportedAs = findOrAddImport({ package: "@unocss/preset-web-fonts", as: "default:presetWebFonts" });

		emptyPresets.elements = [
			...emptyPresets.elements,
			{
				type: "CallExpression",
				callee: {
					type: "Identifier",
					name: presetWebFontsImportedAs,
				},
				optional: false,
				arguments: [],
			},
		];
	}

	if (options.scapel) {
		const presetScalpelImportedAs = findOrAddImport({ package: "unocss-preset-scalpel", as: "presetScalpel" });

		presetsList.elements.push({
			type: "CallExpression",
			callee: {
				type: "Identifier",
				name: presetScalpelImportedAs,
			},
			optional: false,
			arguments: [],
		});
	}

	if (options.chroma) {
		const presetChromaImportedAs = findOrAddImport({ package: "unocss-preset-chroma", as: "presetChroma" });

		presetsList.elements.push({
			type: "CallExpression",
			callee: {
				type: "Identifier",
				name: presetChromaImportedAs,
			},
			optional: false,
			arguments: [],
		});
	}

	if (options.scrollbar) {
		const presetScrollbarImportedAs = findOrAddImport({ package: "unocss-preset-scrollbar", as: "presetScrollbar" });

		presetsList.elements.push({
			type: "CallExpression",
			callee: {
				type: "Identifier",
				name: presetScrollbarImportedAs,
			},
			optional: false,
			arguments: [],
		});
	}

	return unocssConfigAst;
};

/**
 * @param {import("../..").AdderRunArg<import("./__info.js").Options>} param0
 * @returns {Promise<void>}
 */
export const updateUnocssJavaScript = async ({ updateJavaScript, folderInfo, options }) => {
	const cjs = folderInfo.packageType !== "module";

	return updateJavaScript({
		path: cjs ? "/unocss.config.cjs" : "/unocss.config.js",
		async script({ typeScriptEstree }) {
			return {
				typeScriptEstree: updateUnocssConfig(typeScriptEstree, options, cjs),
			};
		},
	});
};
