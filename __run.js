import { installUnocss } from "./0_pkg.js";
import { updateUnocssJavaScript } from "./1_unocss.js";
import { updateViteJavaScript } from "./2_vite.js";

/** @type {import("../..").AdderRun<import("./__info.js").Options>} */
export const run = async (runOpts) => {
	await installUnocss(runOpts);

	await updateUnocssJavaScript(runOpts);

	await updateViteJavaScript(runOpts);
};
