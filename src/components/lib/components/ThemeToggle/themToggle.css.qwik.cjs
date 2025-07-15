"use strict";
const themeTogglecss = ".themeIcon {\n  opacity: 0;\n  transition: opacity 400ms ease-in-out;\n}\n\nhtml[data-theme='light'] .themeIcon.light,\nhtml[data-theme='dark'] .themeIcon.dark,\nhtml:not([data-theme]) .themeIcon.auto {\n  opacity: 1;\n}\n";
module.exports = themeTogglecss;
