// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  fix: true,
  rules: {
    "vue/multi-word-component-names": "warn",
    "vue/valid-template-root": "warn",
  },
});
