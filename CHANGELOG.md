# Changelog


## v1.3.0

[compare changes](https://github.com/jjlabsio/korea-stock-mcp/compare/v1.2.1...v1.3.0)

### 🚀 Enhancements

- Add corp code JSON generation script ([a068b3c](https://github.com/jjlabsio/korea-stock-mcp/commit/a068b3c))
- Add GitHub Pages corp code proxy fetch ([8d20b87](https://github.com/jjlabsio/korea-stock-mcp/commit/8d20b87))
- Use GitHub Pages proxy for corp code lookup with DART fallback ([9f50b7e](https://github.com/jjlabsio/korea-stock-mcp/commit/9f50b7e))

### 🩹 Fixes

- Filter listed companies only in proxy JSON and add DART fallback for unlisted lookups ([ed2fc53](https://github.com/jjlabsio/korea-stock-mcp/commit/ed2fc53))
- Use npx tsx directly to avoid npm stdout prefix in generated JSON ([77976e6](https://github.com/jjlabsio/korea-stock-mcp/commit/77976e6))

### 📖 Documentation

- Add GitHub Pages corp code proxy implementation plan ([148b6f8](https://github.com/jjlabsio/korea-stock-mcp/commit/148b6f8))

### 🤖 CI

- Add daily corp code update workflow ([209837b](https://github.com/jjlabsio/korea-stock-mcp/commit/209837b))

### ❤️ Contributors

- 송재진 ([@jjlabsio](https://github.com/jjlabsio))

## v1.2.1

[compare changes](https://github.com/jjlabsio/korea-stock-mcp/compare/v1.2.0...v1.2.1)

### 📖 Documentation

- Document stock_code parameter support in get_corp_code ([ae944e3](https://github.com/jjlabsio/korea-stock-mcp/commit/ae944e3))

### ❤️ Contributors

- 송재진 ([@jjlabsio](https://github.com/jjlabsio))

## v1.2.0

[compare changes](https://github.com/jjlabsio/korea-stock-mcp/compare/v1.1.7...v1.2.0)

### 🚀 Enhancements

- Support stock_code lookup in get_corp_code and fix XML number parsing ([306d7bb](https://github.com/jjlabsio/korea-stock-mcp/commit/306d7bb))

### 🩹 Fixes

- Show meaningful DART API error instead of ZIP parse failure in get_corp_code ([35e40e7](https://github.com/jjlabsio/korea-stock-mcp/commit/35e40e7))
- Surface DART/KRX API errors instead of cryptic MCP errors ([b1ecc4f](https://github.com/jjlabsio/korea-stock-mcp/commit/b1ecc4f))
- Use parseTagValue:false in error XML parser to prevent status code coercion ([35282ea](https://github.com/jjlabsio/korea-stock-mcp/commit/35282ea))
- Clarify stock_code format (6-digit) in corp_name search failure message ([e0d1632](https://github.com/jjlabsio/korea-stock-mcp/commit/e0d1632))
- Check npm login before release to prevent partial releases ([a80cb16](https://github.com/jjlabsio/korea-stock-mcp/commit/a80cb16))

### 💅 Refactors

- Extract shared DART error validation and unify error message format ([49123a3](https://github.com/jjlabsio/korea-stock-mcp/commit/49123a3))

### 🏡 Chore

- Automate changelog and GitHub release notes with changelogen ([8e68948](https://github.com/jjlabsio/korea-stock-mcp/commit/8e68948))

### ❤️ Contributors

- 송재진 ([@jjlabsio](https://github.com/jjlabsio))

