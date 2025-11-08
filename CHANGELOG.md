# Changelog
All notable changes to the project will be documented in this document.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.1] - 2025-11-08
- Fix `HashMap` and `HashSet` iterator types to be `MapIterator` and `SetIterator` to be assignment-compatible with native `ReadonlyMap` and `ReadonlySet` types (type-level only change).
- Update dev dependencies: `typescript`, `vitest` and `rimraf`.

## [0.2.0] - 2025-11-08 [YANKED]

## [0.1.0] - 2025-03-14
- Initial release with:
  * Collection classes: `HashMap`, `HashSet`.
  * Interface types: `ReadonlyHashMap`, `ReadonlyHashSet`.
  * Hash functions: `chainHash()`, `dropHighestNonSignBit()`, `hashBigInt()`, `hashNumber()`, `hashString()`, `hashTuple()`, `hashValue()`.

[0.2.1]: https://github.com/reactodia/hashmap/compare/v0.1.0...v0.2.1
[0.2.0]: https://github.com/reactodia/hashmap/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/reactodia/hashmap/commits/v0.1.0
