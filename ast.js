import { addImport, findImport } from "../../ast-tools.js";

/**
 * @param {object} param0
 * @param {import("estree").ObjectExpression} param0.configObject
 * @returns {import("estree").ObjectExpression}
 */
export const getKitObject = ({ configObject }) => {
	// Try to find kit config
	/** @type {import("estree").Property | undefined} */
	let kitConfig;
	for (const property of configObject.properties) {
		if (property.type !== "Property") continue;
		if (property.key.type !== "Identifier") continue;
		if (property.key.name !== "kit") continue;

		kitConfig = property;
	}

	// Or set it to an empty object if it doesn't exist
	if (!kitConfig) {
		kitConfig = {
			type: "Property",
			computed: false,
			key: {
				type: "Identifier",
				name: "kit",
			},
			kind: "init",
			method: false,
			shorthand: false,
			value: {
				type: "ObjectExpression",
				properties: [],
			},
		};
		configObject.properties.push(kitConfig);
	}

	/** @type {any} */
	const value = kitConfig.value;
	return value;
};

/**
 * @param {object} param0
 * @param {import("estree").ObjectExpression} param0.configObject
 * @returns {import("estree").ObjectExpression}
 */
export const getViteObject = ({ configObject }) => {
	const kitConfig = getKitObject({ configObject });

	// Try to find vite config
	/** @type {import("estree").Property | undefined} */
	let viteProperty;
	for (const property of kitConfig.properties) {
		if (property.type !== "Property") continue;
		if (property.key.type !== "Identifier") continue;
		if (property.key.name !== "vite") continue;

		viteProperty = property;
	}

	// Or set it to an empty object if it doesn't exist
	if (!viteProperty) {
		viteProperty = {
			type: "Property",
			computed: false,
			key: {
				type: "Identifier",
				name: "vite",
			},
			kind: "init",
			method: false,
			shorthand: false,
			value: {
				type: "ObjectExpression",
				properties: [],
			},
		};
		kitConfig.properties.push(viteProperty);
	}

	/** @type {any} */
	const value = viteProperty.value;
	return value;
};

/**
 * @param {object} param0
 * @param {import("estree").ObjectExpression} param0.configObject
 * @returns {import("estree").ArrayExpression}
 */
export const getVitePluginsArray = ({ configObject }, isViteConf = false) => {
	const viteConfig = isViteConf ? configObject : getViteObject({ configObject });

	// Try to find preprocess config
	/** @type {import("estree").Property | undefined} */
	let pluginsConfig;
	for (const property of viteConfig.properties) {
		if (property.type !== "Property") continue;
		if (property.key.type !== "Identifier") continue;
		if (property.key.name !== "plugins") continue;

		pluginsConfig = property;
	}

	// Or set it to an empty array if it doesn't exist
	if (!pluginsConfig) {
		pluginsConfig = {
			type: "Property",
			computed: false,
			key: {
				type: "Identifier",
				name: "plugins",
			},
			kind: "init",
			method: false,
			shorthand: false,
			value: {
				type: "ArrayExpression",
				elements: [],
			},
		};
		viteConfig.properties.push(pluginsConfig);
	}

	/** @type {any} */
	const value = pluginsConfig.value;
	return value;
};

/**
 * @typedef {function({package:string; as:string; ext?:boolean}):string} FindOrAddImportFn
 */

/**
 * @param {import("../../ast-io.js").RecastAST} ast
 * @param {boolean} cjs
 * @returns {FindOrAddImportFn}
 */
export const findOrAddImportFn =
	(ast, cjs) =>
	({ package: pkg, as: _as }) => {
		const opts = { cjs, package: pkg, typeScriptEstree: ast };
		let importedAs = findImport(opts).require;
		if (!importedAs) {
			let [exportedAs, _importedAs] = _as.split(":");
			importedAs = _importedAs;
			if (!importedAs) {
				importedAs = _importedAs = exportedAs;
			}
			addImport({ ...opts, named: { [exportedAs]: _importedAs } });
		}

		return importedAs;
	};
