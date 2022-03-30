<h1 align="center">1️⃣ Add unocss to Svelte</h1>

This is an adder for `svelte-add`; you should [read its `README`](https://github.com/svelte-add/svelte-add#readme) before continuing here.

## ➕ Adding unocss

This adder's codename is `unocss`, and can be used like so:

```sh
npx svelte-add@latest unocss
```

### 🏞 Supported environments

This adder supports SvelteKit and Vite-powered Svelte apps (all the environments `svelte-add` currently supports).

### ⚙️ Options

- `uno` (default `true`): whether or not to set up the [attributify-preset](https://github.com/unocss/unocss/tree/main/packages/preset-attributify).

- `mini` (default `false`): whether or not to set up the [mini-preset](https://github.com/unocss/unocss/tree/main/packages/preset-mini).

- `windi` (default `false`): whether or not to set up the [windi-preset](https://github.com/unocss/unocss/tree/main/packages/preset-windi).

- `attributify` (default `false`): whether or not to set up the [attributify-preset](https://github.com/unocss/unocss/tree/main/packages/preset-attributify).

- `icons` (default `false`): whether or not to set up the [icons-preset](https://github.com/unocss/unocss/tree/main/packages/preset-icons).

- `webfonts` (default `false`): whether or not to set up the [web-fonts-preset](https://github.com/unocss/unocss/tree/main/packages/preset-web-fonts).

- `typography` (default `false`): whether or not to set up the [typography-preset](https://github.com/unocss/unocss/tree/main/packages/preset-typography).

- `scapel` (default `false`): whether or not to install and set up the [unocss-preset-scalpel](https://github.com/macheteHot/unocss-preset-scalpel).

- `chroma` (default `false`): whether or not to install and set up the [unocss-preset-chroma](https://github.com/chu121su12/unocss-preset-chroma).

- `scrollbar` (default `false`): whether or not to install and set up the [unocss-preset-scrollbar](https://github.com/action-hong/unocss-preset-scrollbar).

## 🛠 Using unocss

After the adder runs,

- You can use unocss utility classes like `bg-blue-700` in the markup (components, routes, `app.html`).

- You need to import unocss in your [page|component|__layout].svelte file ```import 'uno.css';```
