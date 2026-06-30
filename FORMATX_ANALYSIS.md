# FormatX Analysis

React FormatX in `workspace/apps/formatx` was audited as the source of truth. The Angular migration preserves the formatter pipeline, language detection heuristics, Prism syntax highlighting, local preference persistence, upload/download/clipboard workflows, undo/redo history, keyboard shortcuts, themes, accents, glass UI, and responsive two-panel editor.

The Angular implementation lives only in `src/app/features/formatx` and is exposed through a lazy `/formatx` route. Existing React apps, EMS, ShareX, PassX, and workspace configuration were not converted or refactored.
