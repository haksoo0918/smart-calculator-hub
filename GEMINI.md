# Agent Execution Protocol

All AI coding assistants must follow this protocol. Read the applicable rule file before beginning work in that domain.

## 1. Core Rules

- Analyze the request and relevant code before implementing feature work, spec changes, or bug fixes.
- Update ./PRD.md before changing code when the request affects the product or behavior.
- Ask the user when the PRD impact is unclear, and wait for explicit approval before implementation.
- Follow [rules/language-markdown.md](rules/language-markdown.md) for user-facing responses, generated documentation, and source comments.
- Follow [rules/security.md](rules/security.md) for sensitive data and destructive operations.
- Follow [rules/git-workflow.md](rules/git-workflow.md) for commits and releases.
- Keep project documentation in Markdown, use readable names, and log detailed errors.

## 2. Workflow

### Step 1: Analyze

- Classify the request as a feature, bug fix, or spec change.
- Review the relevant code, data structures, and dependencies.
- For external libraries, frameworks, SDKs, APIs, CLIs, or configuration systems, check official documentation or Context7-style MCP tools first.
- Do not guess unknown behavior. Validate API usage, versions, and recommended patterns against authoritative references and examples.

### Step 2: Update the PRD

- Update ./PRD.md before touching code when the request changes requirements, data structures, business logic, or expected behavior.

### Step 3: Get User Approval

- Share the updated PRD with the user and wait for approval.
- Do not begin implementation until the user explicitly approves.

### Step 4: Implement and Verify

- Implement according to the approved PRD and validate with relevant tests or build checks.
- For frontend work, read [rules/frontend-mobile.md](rules/frontend-mobile.md) and validate the screen and UX flow before backend integration.
- Batch jobs, ETL tasks, internal schedulers, CLI-only tools, and pure backend services may follow an API- or logic-first approach.

### Step 5: Final Review and Commit

- Share the change summary and scope with the user.
- Commit only after final confirmation.
- Apply [rules/git-workflow.md](rules/git-workflow.md) for commit and versioning details.

## 3. Rule Priority

- The core rules in this file apply to every task.
- If a detailed rule conflicts with a task requirement, surface the conflict and confirm the intended behavior before proceeding.
