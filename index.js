class RunKitEmbed extends HTMLElement {
    constructor() {
        super();

        const source = this.textContent;
        this.textContent = "";
        const tempCodePlaceholder = document.createElement('pre');
        tempCodePlaceholder.textContent = source;

        const defaultOptions = {
            source,
            nodeVersion: "16.14.2",
            onLoad: () => tempCodePlaceholder.remove()
        };

        const notebookOptions = typeof window.$docsify.runkitPlugin.getEmbedOptions === "function"
            ? window.$docsify.runkitPlugin.getEmbedOptions(source, defaultOptions)
            : defaultOptions;

        if (!notebookOptions.element) {
            const wrapper = document.createElement('div');
            wrapper.style = "margin: 20pt";
            notebookOptions.element = wrapper;
        }

        window.RunKit.createNotebook(notebookOptions);
        this.appendChild(notebookOptions.element);
        this.appendChild(tempCodePlaceholder);
    }
}
customElements.define('rk-embed', RunKitEmbed);

const createCodeFn = function(oCodeFn) {
    return function(code, lang) {
        const runkitLanguages = window.$docsify.runkitPlugin.languages || ['js', 'javascript'];
        if (runkitLanguages.includes(lang)) {
            // rk-embed is a custom pl
            return `<rk-embed>${code.replace(/@DOCSIFY_QM@/g, '`')}</rk-embed>`
        } else {
            if (oCodeFn) {
                return oCodeFn.apply(this, arguments)
            } else {
                lang = lang || ''
                var hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)
                return '<pre v-pre data-lang="' + lang + '"><code class="lang-' + lang + '">' + hl + '</code></pre>'
            }
        }
    }
};

window.$docsify = window.$docsify || {};
window.$docsify.markdown = window.$docsify.markdown || {};
window.$docsify.markdown.renderer = window.$docsify.markdown.renderer || {};

window.$docsify.markdown.renderer.code = createCodeFn(window.$docsify.markdown.renderer.code);

window.$docsify.runkitPlugin = window.$docsify.runkitPlugin || {};
