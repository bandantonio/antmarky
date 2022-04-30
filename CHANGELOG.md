# Changelog

This document outlines the summary of all notable changes to the project.

## [v0.10.0](https://github.com/bandantonio/antmarky/compare/v0.9.0...v0.10.0) - 30 April 2022

### Improvements 📈

- 🚀 ci: configure release actions ([`631df77`](https://github.com/bandantonio/antmarky/commit/631df776517ed7462e068cf3f790eee6c2a1b580))
- ℹ️ chore: update bump script to push lw-tags ([`d90c8a9`](https://github.com/bandantonio/antmarky/commit/d90c8a9546df524704fce72cf79ab0d6f5892131))

----

## [v0.9.0](https://github.com/bandantonio/antmarky/compare/v0.8.0...v0.9.0) - 26 April 2022

### New ✨

- feat: add conventional changelog ([`24665d4`](https://github.com/bandantonio/antmarky/commit/24665d4b55ba7d0d961af36c18ca53a99f623c5c))

### Documentation 📚

- docs(readme): switch to 'directory' naming ([`2f476d8`](https://github.com/bandantonio/antmarky/commit/2f476d8242a4e8720be278a00dca06cf52bbdfe9))

### Improvements 📈

- 🚀 ci(pipeline): add caching stage for nodejs setup ([`127c677`](https://github.com/bandantonio/antmarky/commit/127c67749798c5c6387e748704aaefa8fff310e8))
- ✅ test(core): add unit tests for core functions ([`f84358a`](https://github.com/bandantonio/antmarky/commit/f84358a38276b792dad3ead84ad873f568aedbf9))
- ♻️ refactor(core): perform code linting ([`f9134ab`](https://github.com/bandantonio/antmarky/commit/f9134ab8a0fbc73fb8c93d2bd57e67a7727e6b58))
- ♻️ refactor(core): improve code to rise test coverage ([`5d3f943`](https://github.com/bandantonio/antmarky/commit/5d3f94387992416b31924f187a000801cf5ab3f8))
- ✅ test(core): add validation for filenames ([`7e22233`](https://github.com/bandantonio/antmarky/commit/7e22233500ea3fee7d59bbcaa38b7657f95eeb13))
- ✅ test: add coveralls.io coverage ([`f0f2916`](https://github.com/bandantonio/antmarky/commit/f0f2916b14f44eb238ea5e1388d981f57834c241))
- 🚀 ci(pipeline): add linter to workflow ([`28960d3`](https://github.com/bandantonio/antmarky/commit/28960d3da7147bbf267fefbd5f34e8d935f57385))
- 🎨 style(mobile): resolve broken directory alignment ([`3265d5f`](https://github.com/bandantonio/antmarky/commit/3265d5f478fdfba08a05cc82815f35abf7f42db9))
- ♻️ refactor(core): add validation for doc assets ([`63f9957`](https://github.com/bandantonio/antmarky/commit/63f9957d4d319bb50d85b4e149eef3a92af4f75c))

----

## [v0.8.0](https://github.com/bandantonio/antmarky/compare/v0.7.0...v0.8.0) - 29 March 2022

### Breaking Changes ⚠️

refactor!: drop support for &lt;sub&gt; and &lt;sup&gt; syntax ([`0faab68`](https://github.com/bandantonio/antmarky/commit/0faab680ba9f11fc8e44293a016237f11ef3a6c2))

### Bug fixes 🐛

- fix(style): resolve broken styling after build ([`96e9e3e`](https://github.com/bandantonio/antmarky/commit/96e9e3ef5b932f49aba5e139f9995afa2506fd4f))
- fix(pipeline): remove 'main' tag from docker build ([`9d08029`](https://github.com/bandantonio/antmarky/commit/9d080293f137c2dbac6714d337af664fe0fb9bbd))
- fix: respect empty line after title in admonitions ([`3e22995`](https://github.com/bandantonio/antmarky/commit/3e2299550713eca5cd10f5bc0340988a9a273160))

### Improvements 📈

- ♻️ refactor(core): add input parameters validation ([`75331fc`](https://github.com/bandantonio/antmarky/commit/75331fc8721d359ca01492b80145d824e9626b22))
- 🎨 style: add new admonition types and update styling ([`2d51ea0`](https://github.com/bandantonio/antmarky/commit/2d51ea09bfe1aeb32fdb5bce893763dc7d0c6555))
- 🚀 ci(pipeline): integrate mocha test runner ([`00792fe`](https://github.com/bandantonio/antmarky/commit/00792fef866cca0006293572210f63b777134a3f))
- 🎨 style(main): add styling for links ([`44cb210`](https://github.com/bandantonio/antmarky/commit/44cb210cf66fb19b3ffe866b6e29a9f6fed0790f))

----

## [v0.7.0](https://github.com/bandantonio/antmarky/compare/v0.6.0...v0.7.0) - 19 March 2022

### New ✨

- feat(core): add child dir traversal for md files ([`f4019d1`](https://github.com/bandantonio/antmarky/commit/f4019d13b2df1df7a107d6bead5551412418aa97))

### Documentation 📚

- docs(readme): fix minor grammar issue ([`4abc304`](https://github.com/bandantonio/antmarky/commit/4abc304220b79ac2f3c330828023c69b13036647))

### Improvements 📈

- 🎨 style: make sidebars fixed when scrolling content ([`bd90ddf`](https://github.com/bandantonio/antmarky/commit/bd90ddfb468b77a3accbe7756bcc846104f559bb))
- 🎨 style: add anchors (hashtags) to headings ([`a980a4f`](https://github.com/bandantonio/antmarky/commit/a980a4fd930718bfaf15b6c97ba4c694fbfb967c))
- 🎨 style: add scroll spy for anchors ([`3e8b9bd`](https://github.com/bandantonio/antmarky/commit/3e8b9bd9b38fa2ec62f8e5f3c6f97bdaf26047cc))
- ♻️ refactor: add default params and update fs calls ([`16ec43c`](https://github.com/bandantonio/antmarky/commit/16ec43c4ca13efb867d68b1f2676c6bbc94b3809))

----

## [v0.6.0](https://github.com/bandantonio/antmarky/compare/v0.5.0...v0.6.0) - 19 February 2022

### New ✨

- feat: add language labels to code blocks ([`31f86ff`](https://github.com/bandantonio/antmarky/commit/31f86ffb6dac01a226da16b925c5d41313f40c92))

### Documentation 📚

- docs: merge quickstart info into README ([`c197bed`](https://github.com/bandantonio/antmarky/commit/c197beda62f97e80ba51ba02659e9b77474bb513))
- docs: highlight the idea of creating Antmarky ([`9aeae1f`](https://github.com/bandantonio/antmarky/commit/9aeae1f5ee424b1f32f4eff206e25645db1714da))

### Improvements 📈

- 🎨 style(main): update font-family look and feel ([`744d678`](https://github.com/bandantonio/antmarky/commit/744d678474be5fe0d45434f5a1389cbc03c9d56e))
- 🚀 ci(pipeline): add docker build and push stages ([`83a98c4`](https://github.com/bandantonio/antmarky/commit/83a98c4c864a7fccdbabd714cc36ba6c8d0be50d))
- 🚀 ci(pipeline): add preview env for deployments ([`a365455`](https://github.com/bandantonio/antmarky/commit/a36545551d8e3096a47600aace49f80da4ca603d))

----

## [v0.5.0](https://github.com/bandantonio/antmarky/compare/v0.4.0...v0.5.0) - 5 February 2022

### New ✨

- feat(core): add support of remote markdown files ([`faba169`](https://github.com/bandantonio/antmarky/commit/faba1690d51d43946185bfa0ab9733bb128f420d))

----

## [v0.4.0](https://github.com/bandantonio/antmarky/compare/v0.3.0...v0.4.0) - 18 January 2022

### New ✨

- feat(core): add docker image for serve/build ([`7d8ca5e`](https://github.com/bandantonio/antmarky/commit/7d8ca5e691ae9f2310ce729e81dd1b95d4b573bd))

----

## [v0.3.0](https://github.com/bandantonio/antmarky/compare/v0.2.0...v0.3.0) - 17 January 2022

### New ✨

- feat(core): add indents for nested headings in toc ([`bc83c30`](https://github.com/bandantonio/antmarky/commit/bc83c3037310a17557a929a9dd621cfbd70c312f))

### Bug fixes 🐛

- fix(core): add multiline content support in admonitions ([`2f381a6`](https://github.com/bandantonio/antmarky/commit/2f381a6909342407386292fee1d92df60d49c580))
- fix(core): add render context for 404 template ([`dbdeab8`](https://github.com/bandantonio/antmarky/commit/dbdeab854b2f0a378284b8fe87d9a537ddc18ad8))

### Documentation 📚

- docs: describe all supported features ([`6ddfeed`](https://github.com/bandantonio/antmarky/commit/6ddfeed69a7a7d6ea0cd272eccefac635c1040b0))

### Improvements 📈

- 🎨 style(mobile): add support for low-res devices ([`b6a7f4c`](https://github.com/bandantonio/antmarky/commit/b6a7f4c964c9d4f118960a17bebf2f373a21f8c3))
- 🚀 ci(pipeline): add 'fail on error' conditions ([`4c0f7a3`](https://github.com/bandantonio/antmarky/commit/4c0f7a3fc810308b3175cc780529c9af02a85e73))

----

## [v0.2.0](https://github.com/bandantonio/antmarky/compare/v0.1.0...v0.2.0) - 24 December 2021

### New ✨

- feat(core): add support of default docs directory ([`2ad2cb0`](https://github.com/bandantonio/antmarky/commit/2ad2cb0bdef65f82954ed7494dd73447a9a51aa3))

### Bug fixes 🐛

- fix(core): correct invalid path to README ([`4bcb35b`](https://github.com/bandantonio/antmarky/commit/4bcb35b08b9f179699a37920fb78f624517f0cd7))

### Documentation 📚

- docs(readme): add initial build instructions ([`1fe15c2`](https://github.com/bandantonio/antmarky/commit/1fe15c2b97134082145ea85f6e3610a55da3ade4))

### Improvements 📈

- 🚀 ci(gh-pages): add initial deployment workflow ([`01a099d`](https://github.com/bandantonio/antmarky/commit/01a099d18554a8ee297da49c73b4999666b03b51))

----

## v0.1.0 - 22 December 2021

### New ✨

- feat(core): add base mvp to convert md to html ([`fc486d2`](https://github.com/bandantonio/antmarky/commit/fc486d2de67411a13fb273d63dc3fe534ca70fa5))

----
