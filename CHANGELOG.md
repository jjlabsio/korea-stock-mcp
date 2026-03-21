# Changelog


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

