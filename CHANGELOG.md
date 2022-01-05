# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.8](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.6...v0.2.8) (2022-01-05)


### Bug Fixes

* failed to load esm module ([1e51b3a](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/1e51b3a7f0c4e1a643a16f691e2a9c2740baa00b))
* object keys may contain `.`(dot) ([385be7a](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/385be7a24596130fee960ad58bb1b71e57772cfd))

### [0.2.7](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.6...v0.2.7) (2022-01-02)


### Bug Fixes

* object keys may contain `.`(dot) ([385be7a](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/385be7a24596130fee960ad58bb1b71e57772cfd))

### [0.2.6](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.5...v0.2.6) (2021-12-28)


### Bug Fixes

* should not replace process envs ([83e58ac](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/83e58ace8159486ed3f46c4318e0bb1f557aca31))

### [0.2.5](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.4...v0.2.5) (2021-12-23)


### Features

* add merge option ([fb3c3bd](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/fb3c3bde3da868e82e52f726cebb3121f39cc723))

### [0.2.4](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.3...v0.2.4) (2021-12-21)


### Features

* add beforeHydrate hook ([c1bc1ae](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/c1bc1ae3118d6c5040a608bb35853807e3fbd7ad))


### Bug Fixes

* losing type information ([9b2326e](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/9b2326ec25ef6a5c774baedb42d44b7d7d651bbb))

### [0.2.3](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.2...v0.2.3) (2021-12-19)


### Bug Fixes

* forgot to resolve when there is no persisted state ([1ac0f7c](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/1ac0f7c55cc25fea6c03b07dcbb68f778c95f0bc))

### [0.2.2](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.1...v0.2.2) (2021-12-18)


### Features

* support migration ([ef3a1fc](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/ef3a1fc77f9ca42a1a983c309f9bf95e02f96506))

### [0.2.1](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.2.0...v0.2.1) (2021-12-15)

## [0.2.0](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.1.4...v0.2.0) (2021-12-14)


### ⚠ BREAKING CHANGES

* serialization is renamed as serialize, deserialization is renamed as deserialize

### Features

* allow to disable plugin by default and enable for specific stores ([347d51c](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/347d51c6c37d50ad2afd9a0e0f9c24dbcf58ef32))
* allow to persist blob or other types supported by storage ([f23ace7](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/f23ace787f48d90e83f8c845aebe0e4022c25ce8))
* use verb ([106ba31](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/106ba31e01ece9a80484d6f50d6049eedf18436c))


### Bug Fixes

* exclude path may be in include path ([4e6c04f](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/4e6c04f713a5ce08c11d6da5c2560f706d5a716b))

### [0.1.4](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.1.3...v0.1.4) (2021-12-11)


### Features

* asynchronous storage ([a5f6097](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/a5f6097bb067a4f74ecded52265bbe38f5a74a4d)), closes [#3](https://github.com/iendeavor/pinia-plugin-persistedstate-2/issues/3)

### [0.1.3](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.1.2...v0.1.3) (2021-12-10)


### Features

* allow to disable persisting stores ([34a0a06](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/34a0a06dfc41c3eeced675ba8f495d07d422c824))

### [0.1.2](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.1.1...v0.1.2) (2021-12-05)


### Bug Fixes

* window is undefined in SSR ([3d8cd62](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/3d8cd6293bc504ae3aa853a91a57767c26f289dc))

### [0.1.1](https://github.com/iendeavor/pinia-plugin-persistedstate-2/compare/v0.1.0...v0.1.1) (2021-12-05)


### Features

* rename ([0c911c4](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/0c911c40a5faa64a0a9110c9dda73f413b8b6b69))


### Bug Fixes

* wrong types path ([fa2ac15](https://github.com/iendeavor/pinia-plugin-persistedstate-2/commit/fa2ac1555195c1fe430f1182ed8ca94e87bd64ae))

## 0.1.0 (2021-12-05)
