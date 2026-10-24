import { Repository, Mission, Badge } from '../types';

export const CURATED_REPOSITORIES: Repository[] = [
  {
    id: 'repo-excalidraw',
    owner: 'excalidraw',
    name: 'excalidraw',
    description: 'Virtual whiteboard for sketching hand-drawn like diagrams with collaborative editing.',
    stars: 84200,
    forks: 8300,
    primaryLanguage: 'TypeScript',
    healthScore: 94,
    lastCommitDaysAgo: 1,
    maintainerResponseHours: 8,
    openIssuesCount: 142,
    hasContributingGuide: true,
    hasCodeOfConduct: true,
    repoUrl: 'https://github.com/excalidraw/excalidraw',
    avatarUrl: 'https://avatars.githubusercontent.com/u/59489569?v=4',
  },
  {
    id: 'repo-docusaurus',
    owner: 'facebook',
    name: 'docusaurus',
    description: 'Easy to maintain open source documentation websites built with React and Markdown.',
    stars: 56400,
    forks: 8200,
    primaryLanguage: 'TypeScript',
    healthScore: 96,
    lastCommitDaysAgo: 1,
    maintainerResponseHours: 12,
    openIssuesCount: 210,
    hasContributingGuide: true,
    hasCodeOfConduct: true,
    repoUrl: 'https://github.com/facebook/docusaurus',
    avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
  },
  {
    id: 'repo-express',
    owner: 'expressjs',
    name: 'express',
    description: 'Fast, unopinionated, minimalist web framework for Node.js.',
    stars: 65100,
    forks: 15400,
    primaryLanguage: 'JavaScript',
    healthScore: 89,
    lastCommitDaysAgo: 3,
    maintainerResponseHours: 24,
    openIssuesCount: 178,
    hasContributingGuide: true,
    hasCodeOfConduct: true,
    repoUrl: 'https://github.com/expressjs/express',
    avatarUrl: 'https://avatars.githubusercontent.com/u/5658226?v=4',
  },
  {
    id: 'repo-fastapi',
    owner: 'fastapi',
    name: 'fastapi',
    description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production.',
    stars: 79800,
    forks: 6800,
    primaryLanguage: 'Python',
    healthScore: 92,
    lastCommitDaysAgo: 2,
    maintainerResponseHours: 14,
    openIssuesCount: 230,
    hasContributingGuide: true,
    hasCodeOfConduct: true,
    repoUrl: 'https://github.com/fastapi/fastapi',
    avatarUrl: 'https://avatars.githubusercontent.com/u/102988188?v=4',
  },
  {
    id: 'repo-vitest',
    owner: 'vitest-dev',
    name: 'vitest',
    description: 'Next generation testing framework powered by Vite for modern JavaScript & TypeScript.',
    stars: 15100,
    forks: 1300,
    primaryLanguage: 'TypeScript',
    healthScore: 98,
    lastCommitDaysAgo: 1,
    maintainerResponseHours: 6,
    openIssuesCount: 160,
    hasContributingGuide: true,
    hasCodeOfConduct: true,
    repoUrl: 'https://github.com/vitest-dev/vitest',
    avatarUrl: 'https://avatars.githubusercontent.com/u/95551717?v=4',
  },
  {
    id: 'repo-supabase',
    owner: 'supabase',
    name: 'supabase',
    description: 'The open source Firebase alternative with Postgres database, Authentication, and instant APIs.',
    stars: 76500,
    forks: 6400,
    primaryLanguage: 'TypeScript',
    healthScore: 95,
    lastCommitDaysAgo: 1,
    maintainerResponseHours: 9,
    openIssuesCount: 310,
    hasContributingGuide: true,
    hasCodeOfConduct: true,
    repoUrl: 'https://github.com/supabase/supabase',
    avatarUrl: 'https://avatars.githubusercontent.com/u/54469796?v=4',
  },
];

export const CURATED_MISSIONS: Mission[] = [
  {
    id: 'mission-excalidraw-eraser-tooltip',
    repoId: 'repo-excalidraw',
    repoName: 'excalidraw',
    repoOwner: 'excalidraw',
    issueNumber: 7421,
    title: 'Show shortcut key "E" in the Eraser tool action button tooltip',
    description: 'When hovering over the canvas toolbar items, each tool displays a tooltip with its name and quick shortcut key (e.g., "Rectangle - R", "Selection - S"). The newly added Eraser tool is missing its shortcut key "E" in the localization string dictionary, leaving users unaware of the keyboard binding.',
    issueUrl: 'https://github.com/excalidraw/excalidraw/issues/7421',
    difficulty: 'Beginner',
    type: 'bug',
    technologies: ['TypeScript', 'React', 'CSS'],
    xpReward: 160,
    isAssigned: false,
    availabilityStatus: 'verified_open',
    aiExplanation: 'This is an ideal starter issue because it touches React UI localization and prop passing without touching complex canvas math. You will locate where the Toolbar buttons are rendered and ensure the shortcut key tag is appended to the tooltip title.',
    whyRecommended: 'Perfect match for beginner React/TypeScript contributors. Zero risk of breaking canvas state, clear reproduction steps, and high maintainer merge speed.',
    estimatedHours: 2,
    keyFiles: [
      'packages/excalidraw/components/ToolButton.tsx',
      'packages/excalidraw/components/Actions.tsx',
      'packages/excalidraw/i18n.ts'
    ],
    hints: {
      level1: 'Look at how sibling tools like the Selection (S) or Hand (H) buttons define their tooltips in ToolButton.tsx.',
      level2: 'Check packages/excalidraw/components/Actions.tsx where actionClearCanvas and actionEraser are initialized. Notice the `shortcut` property.',
      level3: 'In `packages/excalidraw/i18n.ts`, verify the key `tool.eraser`. Ensure that the tooltip label component wraps the shortcut key in the shortcut badge renderer `<kbd>E</kbd>`.'
    }
  },
  {
    id: 'mission-docusaurus-broken-links',
    repoId: 'repo-docusaurus',
    repoName: 'docusaurus',
    repoOwner: 'facebook',
    issueNumber: 9184,
    title: 'Clarify broken link reporting file paths in CLI build output',
    description: 'During `docusaurus build`, if markdown documents contain broken relative hyperlinks, the console reporter prints the destination URL but omits the relative source document path when inside sub-nested docs categories, making it tedious for users to find which file originated the error.',
    issueUrl: 'https://github.com/facebook/docusaurus/issues/9184',
    difficulty: 'Beginner',
    type: 'docs',
    technologies: ['TypeScript', 'Node.js'],
    xpReward: 140,
    isAssigned: false,
    availabilityStatus: 'verified_open',
    aiExplanation: 'A small enhancement in the diagnostic reporting utility that extracts the source filepath from the markdown AST node before logging the warning string to stdout.',
    whyRecommended: 'Great for developers interested in build tools and CLI developer experience. Demonstrates how AST node metadata is mapped to clean terminal logs.',
    estimatedHours: 2.5,
    keyFiles: [
      'packages/docusaurus-plugin-content-docs/src/brokenLinks.ts',
      'packages/docusaurus-utils/src/logging.ts'
    ],
    hints: {
      level1: 'Inspect the logger call in `brokenLinks.ts`. The error object already contains a `sourceDoc` reference.',
      level2: 'Format the output using `path.relative(siteDir, docPath)` so users see a clean project-relative file location.',
      level3: 'Update the existing test suite in `packages/docusaurus-plugin-content-docs/src/__tests__/brokenLinks.test.ts` to assert that the logged string matches the expected relative filepath format.'
    }
  },
  {
    id: 'mission-express-deprecation-format',
    repoId: 'repo-express',
    repoName: 'express',
    repoOwner: 'expressjs',
    issueNumber: 5291,
    title: 'Standardize deprecation warning format in router utils for v5 compatibility',
    description: 'In Express 5 beta migration, legacy routing options should emit uniform deprecation notices using the standard `depd` utility. Some middleware submodules currently use raw `console.warn` instead of the configured deprecator helper.',
    issueUrl: 'https://github.com/expressjs/express/issues/5291',
    difficulty: 'Intermediate',
    type: 'tests',
    technologies: ['JavaScript', 'Node.js', 'Mocha'],
    xpReward: 220,
    isAssigned: false,
    availabilityStatus: 'verified_open',
    aiExplanation: 'Express has strict adherence to backward compatibility and minimal dependencies. This task involves swapping ad-hoc warnings with the standardized `depd("express")` instance and adding unit tests verifying the warning event.',
    whyRecommended: 'High-value learning opportunity on the foundational Node.js web server. You will write robust unit tests in Mocha and learn maintainer expectations for semver.',
    estimatedHours: 3,
    keyFiles: [
      'lib/router/index.js',
      'lib/utils.js',
      'test/app.router.js'
    ],
    hints: {
      level1: 'Search for `deprecate(` across `lib/` to see how other router deprecations are emitted.',
      level2: 'Import `var deprecate = require("depd")("express");` and replace the direct console logging.',
      level3: 'In `test/app.router.js`, use a process listener or mock for `process.emitWarning` to assert the message and code.'
    }
  },
  {
    id: 'mission-fastapi-nested-docs',
    repoId: 'repo-fastapi',
    repoName: 'fastapi',
    repoOwner: 'fastapi',
    issueNumber: 6812,
    title: 'Add comprehensive example for deeply nested Pydantic v2 schemas in OpenAPI docs',
    description: 'Developers frequently struggle with configuring custom field descriptions when schemas contain 3+ levels of nested models or recursive self-referential models. We need a clean, tested documentation tutorial and example snippet in `docs/en/docs/tutorial/body-nested-models.md`.',
    issueUrl: 'https://github.com/fastapi/fastapi/issues/6812',
    difficulty: 'Beginner',
    type: 'docs',
    technologies: ['Python', 'Pydantic', 'Markdown'],
    xpReward: 150,
    isAssigned: false,
    availabilityStatus: 'verified_open',
    aiExplanation: 'FastAPI maintains world-class documentation with executable test files accompanying every single tutorial example. You will write both the tutorial markdown and the accompanying runnable Python test.',
    whyRecommended: 'Ideal for Python enthusiasts. FastAPI maintainers deeply appreciate clear documentation PRs with unit test verification.',
    estimatedHours: 2,
    keyFiles: [
      'docs/en/docs/tutorial/body-nested-models.md',
      'docs_src/body_nested_models/tutorial005.py',
      'tests/test_tutorial/test_body_nested_models.py'
    ],
    hints: {
      level1: 'Review existing examples in `docs_src/body_nested_models/`. Follow the numbering convention for new code snippets.',
      level2: 'Create a realistic real-world schema (like an Order with Items and nested Dimensions/Metadata) rather than generic Foo/Bar.',
      level3: 'Ensure the test asserts both the response JSON and the `/openapi.json` generated schema structure.'
    }
  },
  {
    id: 'mission-vitest-sourcemap-fallback',
    repoId: 'repo-vitest',
    repoName: 'vitest',
    repoOwner: 'vitest-dev',
    issueNumber: 4890,
    title: 'Handle undefined source map cleanly in stack trace formatter during inline eval',
    description: 'When running tests with dynamic `eval` or custom virtual modules without a valid source map consumer, Vitest can throw an unhandled TypeError inside `formatStackTrace` when accessing `.sources`. It should gracefully fallback to original line numbers.',
    issueUrl: 'https://github.com/vitest-dev/vitest/issues/4890',
    difficulty: 'Intermediate',
    type: 'bug',
    technologies: ['TypeScript', 'Vite', 'SourceMaps'],
    xpReward: 260,
    isAssigned: false,
    availabilityStatus: 'verified_open',
    aiExplanation: 'Stack trace formatting is essential for developer debugging experience. Adding optional chaining and a defensive fallback prevents test runners from crashing unexpectedly on virtual modules.',
    whyRecommended: 'Deep dive into modern developer tooling internals. Excellent maintainer guidance and immediate impact on thousands of test suites.',
    estimatedHours: 3.5,
    keyFiles: [
      'packages/vitest/src/utils/stack.ts',
      'test/core/test/stacktrace.test.ts'
    ],
    hints: {
      level1: 'Check `packages/vitest/src/utils/stack.ts` in the `parseStack` method where source map resolution takes place.',
      level2: 'Guard against `!map || !map.sources` before querying `originalPositionFor`.',
      level3: 'Add a regression test in `stacktrace.test.ts` that mocks a stack frame pointing to a nonexistent virtual source URL.'
    }
  },
  {
    id: 'mission-supabase-schema-export-check',
    repoId: 'repo-supabase',
    repoName: 'supabase',
    repoOwner: 'supabase',
    issueNumber: 18230,
    title: 'Add validation warning for empty table schema definitions in DB diff CLI command',
    description: 'When generating migrations with `supabase db diff`, if a newly declared schema or table definition has no columns or attributes specified, the generator produces invalid SQL syntax `CREATE TABLE name ();` instead of halting with an actionable error prompt.',
    issueUrl: 'https://github.com/supabase/supabase/issues/18230',
    difficulty: 'Intermediate',
    type: 'feature',
    technologies: ['TypeScript', 'PostgreSQL', 'CLI'],
    xpReward: 280,
    isAssigned: false,
    availabilityStatus: 'verified_open',
    aiExplanation: 'Improves CLI validation UX by catching empty table definitions early before emitting corrupt migration files.',
    whyRecommended: 'Real-world database tool engineering. Teaches input validation, defensive CLI design, and PostgreSQL schema constraints.',
    estimatedHours: 4,
    keyFiles: [
      'packages/cli/src/diff/parser.ts',
      'packages/cli/src/diff/validator.ts',
      'packages/cli/tests/diff.test.ts'
    ],
    hints: {
      level1: 'Inspect the AST parser in `diff/parser.ts` where table statements are parsed.',
      level2: 'Add a validator in `validator.ts` that counts the number of column definitions. If zero, throw a ValidationError with helpful guidance.',
      level3: 'In tests, assert that running diff against an empty table emits exit code 1 with message "Table [name] must contain at least one column definition."'
    }
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge-first-contact',
    title: 'First Contact',
    description: 'Completed your personalized contributor onboarding profile.',
    iconName: 'Compass',
    category: 'first_steps',
    xpBonus: 100,
  },
  {
    id: 'badge-etiquette-scholar',
    title: 'Etiquette Scholar',
    description: 'Mastered the open-source etiquette rules and maintainer empathy code.',
    iconName: 'ShieldCheck',
    category: 'etiquette',
    xpBonus: 150,
  },
  {
    id: 'badge-repo-scout',
    title: 'Repo Scout',
    description: 'Explored active repository architectures and contribution health signals.',
    iconName: 'FolderGit2',
    category: 'technical',
    xpBonus: 120,
  },
  {
    id: 'badge-solution-architect',
    title: 'Solution Architect',
    description: 'Constructed an implementation plan and completed checklist verification.',
    iconName: 'Layers',
    category: 'technical',
    xpBonus: 200,
  },
  {
    id: 'badge-pr-artisan',
    title: 'PR Artisan',
    description: 'Crafted a maintainer-ready, semantic pull request with full test context.',
    iconName: 'GitPullRequest',
    category: 'first_steps',
    xpBonus: 250,
  },
  {
    id: 'badge-streak-pioneer',
    title: 'Consistency Star',
    description: 'Active contributor learning streak maintained across multiple sessions.',
    iconName: 'Flame',
    category: 'streak',
    xpBonus: 180,
  },
];

export const ETIQUETTE_RULES = [
  {
    id: 'rule-maintainers-volunteers',
    title: 'Maintainers Are Often Volunteers',
    summary: 'Most open-source maintainers balance projects alongside demanding full-time jobs and families.',
    guidance: 'Be patient, kind, and respectful. Never demand immediate responses or ping individual maintainers in public channels unless explicitly invited.',
    doExample: '"Thank you for taking a look when you have a free moment! No rush at all."',
    dontExample: '"Any updates??? Ping @maintainer why is this taking 3 days?"',
    category: 'communication'
  },
  {
    id: 'rule-thoughtful-claiming',
    title: 'Claim Issues by Sharing Your Approach',
    summary: 'Maintainers want to know you understand the problem before handing over an issue.',
    guidance: 'Instead of posting generic "Can I work on this?", briefly outline your proposed solution (1-2 sentences) and reference the files you plan to touch.',
    doExample: '"Hi! I would love to tackle this. My plan is to add the missing shortcut prop in ToolButton.tsx and update the test in toolbar.test.tsx. Does that sound good?"',
    dontExample: '"assign me please +1 +1"',
    category: 'workflow'
  },
  {
    id: 'rule-no-giant-refactors',
    title: 'Stick to the Scope — No Unsolicited Refactors',
    summary: 'Keep PRs small, focused, and minimal. Do not reformat entire files with Prettier or change unrelated code.',
    guidance: 'Diffs should only contain code directly required to solve the stated issue. Large diffs are exhausting to review and prone to merge conflicts.',
    doExample: 'A 15-line targeted diff touching only the bugged condition + 1 new test.',
    dontExample: 'A 400-line diff changing tabs to spaces, renaming functions, and rearranging directories.',
    category: 'commit'
  },
  {
    id: 'rule-atomic-git-hygiene',
    title: 'Follow Git Branch & Commit Conventions',
    summary: 'Clean git history reflects professionalism and makes reviews effortless.',
    guidance: 'Always branch from the repository default branch with descriptive names (e.g. `fix/eraser-shortcut-key`). Write semantic commit messages (`fix(toolbar): add shortcut tooltip to eraser`).',
    doExample: 'git checkout -b fix/eraser-tooltip-shortcut && git commit -m "fix(toolbar): display E shortcut in eraser tooltip"',
    dontExample: 'git commit -m "fixed stuff" on `main` branch',
    category: 'commit'
  },
  {
    id: 'rule-gracious-reviews',
    title: 'Embrace Code Review Feedback',
    summary: 'Code review comments are about the code, not your capability as an engineer.',
    guidance: 'When a maintainer asks for adjustments, thank them for their feedback, address each requested change with a new commit, and re-request review politely.',
    doExample: '"Good catch on the undefined check! I updated the validator and added a regression test in commit e4f12b. Ready for re-review."',
    dontExample: 'Arguing defensively or closing the PR out of frustration.',
    category: 'respect'
  }
];

export const TECHNICAL_QUIZ_QUESTIONS = [
  {
    id: 'quiz-1',
    question: 'What is the purpose of "git checkout -b fix/my-feature" when contributing?',
    options: [
      'It creates and switches to a new branch for your isolated changes',
      'It downloads the repository to your local computer',
      'It immediately publishes a pull request to GitHub',
      'It deletes older uncommitted files'
    ],
    correctIndex: 0,
    explanation: 'Branching isolates your changes so you can iterate cleanly without polluting the main branch or interfering with other features.'
  },
  {
    id: 'quiz-2',
    question: 'Why do popular open-source repositories require checking CONTRIBUTING.md first?',
    options: [
      'It details local dev environment setup, commit formatting, and testing rules',
      'It contains the maintainers personal phone numbers',
      'It is legally required by copyright law for all users',
      'It lists every past contributor in alphabetical order'
    ],
    correctIndex: 0,
    explanation: 'CONTRIBUTING.md provides the repo-specific development commandments, linter configs, test runners, and PR guidelines.'
  },
  {
    id: 'quiz-3',
    question: 'What does "Fixes #123" in a GitHub Pull Request description do?',
    options: [
      'It automatically closes issue #123 when the PR is merged into the default branch',
      'It assigns issue #123 to you immediately',
      'It sends an email notification to all 123 followers',
      'It hides the issue from search results'
    ],
    correctIndex: 0,
    explanation: 'GitHub recognizes keywords like "Fixes #123" or "Closes #123" to automate issue lifecycle management upon merge.'
  }
];
