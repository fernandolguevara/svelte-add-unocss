/**
 * @param {import("../..").AdderRunArg<import("./__info.js").Options>} param0
 * @returns {Promise<void>}
 */
export const installUnocss = async ({ install, options }) => {
	await install({ prod: false, package: "unocss" });

	if (options.attributify) {
		await install({ prod: false, package: "@unocss/preset-attributify" });
	}

	if (options.mini) {
		await install({ prod: false, package: "@unocss/preset-mini" });
	}

	if (options.windi) {
		await install({ prod: false, package: "@unocss/preset-wind" });
	}

	if (options.uno) {
		await install({ prod: false, package: "@unocss/preset-uno" });
	}

	if (options.typography) {
		await install({ prod: false, package: "@unocss/preset-typography" });
	}

	if (options.scapel) {
		await install({ prod: false, package: "unocss-preset-scalpel" });
	}

	if (options.chroma) {
		await install({ prod: false, package: "unocss-preset-chroma" });
	}

	if (options.scrollbar) {
		await install({ prod: false, package: "unocss-preset-scrollbar" });
	}
};
