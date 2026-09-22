# Antigravity AI Agent Rules & Token Optimization Policy

## ⚠️ Mandatory Token-Saving Directives

Any AI assistant or agent working on this workspace MUST adhere to the following rules to minimize token usage:

1. **Always Consult `PROJECT_MEMORY.md` First:**
   - Before attempting to view, grep, or edit files, check [`PROJECT_MEMORY.md`](file:///d:/PROJECTS/laundy%20v2/PROJECT_MEMORY.md).
   - It contains the exact line numbers and component bounds for all 14 sections in `index.html`, 16 sections in `styles.css`, and 9 modules in `js/app.js`.

2. **Never Read Full Code Files:**
   - `index.html` is ~87KB and `css/styles.css` is ~52KB.
   - Reading these files in full wastes 30,000–40,000 tokens per call.
   - ALWAYS use `view_file` with explicit `StartLine` and `EndLine` parameters based on the map in `PROJECT_MEMORY.md` (e.g. read only 30–60 lines).

3. **Targeted Surgical Edits:**
   - Use `replace_file_content` targeting small, exact blocks (10–40 lines).
   - Never overwrite large files unless creating a brand-new file.

4. **Instant Automated Validation:**
   - After any change, run `node test_verification.js` using `run_command`.
   - Do NOT spend tokens manually re-reading files to verify them; the test script verifies all 59 critical elements, rate card prices, palette rules, and responsiveness contracts in under 1 second.
