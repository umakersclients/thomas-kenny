# Agents Guide



## General Conventions

- Use **kebab-case** for all filenames and folder names.  
- Files with special names (e.g. `README.md`, `.env`, etc.) are **exceptions** to the kebab-case rule.

---

## SvelteKit Documentation

- All official Svelte and SvelteKit documentation can be found here:  
  👉 https://svelte.dev/llms.txt

---

## SvelteKit Installation

- For **npm** projects:  
  ```bash
  npx sv create my-app
  ```
- For **bun** projects:  
  ```bash
  bunx sv create my-app
  ```

---

## Svelte Code Guide

- Use **Svelte 5**.  
- Prefer **runes**, **normal event names** (`on:click`, not custom wrappers), and **callbacks over dispatch**.  
- use experimental mode for remote functions for those components that dont need ssr
- Create reusable UI components in `components/ui`.  
- Endpoints should contain only endpoint code; move logic into **testable functions**.  
- Keep functions **small, pure, and single-purpose**.  
- Use **descriptive variable names** that clearly express state (e.g. `productsRaw`, `productsMappedToUI`, `productsCleaned`).  
- Place any **reusable code** in `$lib`. Be **aggressive** about identifying candidates for reuse.  
- Component-specific code should remain in the component’s folder or within its `.svelte` file.  
- Preferred import style:
  ```js
  import dates from '$lib/utils/dates'
  dates.fn()
  ```

---

## Documentation and Code Standards

IF THE BELOW IS NOT FOLLOWED IN EXISTING CODE - FIX IT!!

- Every `.js` file should include a short **description of its purpose**.  
- Every function should have a brief **description comment**.  
- Add inline comments where helpful to explain **why** code exists (not just what it does).

---

## UI Components and Components

IF THE BELOW IS NOT FOLLOWED IN EXISTING CODE - SUGGEST FIX IT!!


### process

- make components (with data and logic) before creating ui components. your ui components seems to be specialiced to the logic of the component where the perfect ui component focuses on smaller ui only tasks
- create subcomponents in the same component folder
- put the javascript logic in the component svelte file or javascript file in same folder.
- maybe move some to $lib
- cleanup the page.svelte
- if the page.svelte deals with inner component logic - you need to refactor. **important**

### Summary

| Type | Purpose | Rules |
|------|----------|-------|
| **UI Components** | Reusable smaller presentation elements | - Live in `components/ui` - Never fetch data |
| **Components** | Larger, logic-focused units | - Live in `components`- Can fetch data if SSR not needed<br>- Use UI components internally |

### General Rules

- Identify both **components** and **UI components** aggressively.  
- Reasons to create a **UI component**: reuse, complex styling, or layout. Small. Dont know about the current solution. could be moved to another. 
- Reasons to create a **component**: reuse, simplification, or clear separation of concerns.  
- Each component should have its own folder.  
  - Default file: `index.svelte`  
  - Subcomponents in the same folder.  
  - Add an `index.js` that exports them all.  
- Always check for **existing reusable components** before creating new ones.

---

## Tailwind CSS

- Use **Tailwind CSS** for styling.  
  👉 https://context7.com/websites/tailwindcss/llms.txt

---

## Shadcn-Svelte UI

- Use **shadcn-svelte** when requested.  
- Documentation:  
  - LLM: https://context7.com/websites/shadcn-svelte/llms.txt  
  - Official: https://shadcn-svelte.com/docs  
- If not installed, initialize with:  
  ```bash
  npx shadcn-svelte@latest init
  ```

---

## Code Review and TODOs

- When you identify **code smells**, **bad code**, or **bugs**, add them to `/TODO.md`.  
- In code, mark with:
  ```js
  // TODO: <short description>
  ```
- Each TODO entry should include:
  - **File path**
  - **Short description of issue**
  - **Suggested fix or follow-up date**

---

## Static Data (Starting New Features)

- When beginning new functionality, always start with **test data** from `/data/*.json`.

---

## Database Preference

- Preferred database: **SQLite**  
  - Docs: https://context7.com/sqlite/sqlite/llms.txt  
- Recommended library: **better-sqlite3**  
  - Docs: https://context7.com/wiselibs/better-sqlite3/llms.txt

---

## Philosophy

> Consistency, clarity, and reusability are core principles.  
> Every function, component, and file should be easy to understand and built for collaboration.