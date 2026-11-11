# TANJE Restaurant Operations Management System

## Project audit and independent-production migration assessment

**Audit date** — 11 November 2026, Asia/Tehran  
**Inspected repository** — `tanje-menu-fix/.sites-checkout` (latest implementation)
**Historical checkout** — `tanje-operations` (preserved initial implementation)  
**Inspected commit** — `ccabb9932743810f126bc9139054cd1e38712e55`
**Compared initial commit** — `b462c101ebed57c8d9f7d68083fe6bea2f6da760`  
**Decision status** — Assessment and recommendations for approval  
**Production-readiness score** — **25 / 100**

### Scope, evidence, and preservation

The assessment covers all seven tracked files in the latest checkout, both available Git commits, both existing deployment archives, every application view, every entry form, application calculations, storage, styles, and hosting configuration. The latest checkout was clean before the audit. The historical checkout contains the earlier untracked PROJECT_AUDIT.md, which is preserved. No local AGENTS.md instructions were found in the scoped workspace.

This report is a new deliverable outside both checkouts, under audit-latest/PROJECT_AUDIT.md. Its filename matches the request while preserving the earlier report. Existing source files, fonts, manifests, Git configuration, previous report, and deployment archives were preserved. No packages were installed, no application changes were implemented, and no deployment or access changes were made. Content hashes for both checkouts and the earlier report were captured for final comparison.

Evidence comprises complete source inspection, comparison of both commits, a JavaScript syntax check, isolated in-memory execution with stubbed DOM/storage interfaces, archive-content comparison, font-metadata inspection, and read-only hosting metadata. Synthetic data was used only in memory. No actual browser storage was read or changed.

No preview server was started and no fresh real-browser acceptance test was performed in this read-only audit. A desktop preview was inspected during the preceding menu-fix task. That historical observation does not establish mobile-touch, keyboard, screen-reader, print-layout, or cross-browser acceptance. The earlier report's unavailable-preview observation is historical and is not asserted as a current infrastructure failure.

Each existing archive contains seven regular files. Bytes in tanje-deployment.tar.gz match the initial checkout. Bytes in tanje-menu-fix.tar.gz match the latest checkout, including packaged hosting manifests. Read-only metadata reports an active version 2 publication with custom audience access and one external viewer. This establishes hosting configuration, not employee permissions, a shared database, or successful access by that viewer. Identities, signed URLs, and authentication material are omitted.

### Changes since the preceding audit

The latest implementation adds setNavOpen(), a separate outside-click backdrop, a trigger with aria-controls/aria-expanded, and closing on navigation, repeated toggle, outside click, and Escape. Outside-click and Escape closing restore focus to the trigger. These behaviors are present in source and pass isolated event-handler checks.

No backend, database, employee role, import-file, export-file, stock, costing, or report-calculation feature was added in this commit. The score remains 25/100 because the central data, authorization, and recovery blockers remain.

The earlier report is retained as an assessment of the initial commit. This report supersedes its current-state mobile-menu findings while retaining business and migration findings supported by the unchanged code.

## 1. Executive summary

TANJE currently has a Persian, right-to-left, static single-page demo. It uses HTML, CSS, and vanilla JavaScript. Its eight screens and nine forms provide a useful interactive model of the proposed operations system.

Several features are genuinely implemented in the browser. Users can enter receipts, transfer central stock to a restaurant, define materials and menu recipes, record sales that consume recipe quantities, record waste or staff consumption, and compare physical counts against calculated stock. Dashboards calculate totals from the browser's current dataset. These are executable client-side features.

The system has no TANJE application server, relational database, application authentication, employee identity model, permission enforcement, or business API. Records are stored as a single JSON document in localStorage for the current website origin and browser profile. Inviting another person to the hosted site gives them their own browser dataset. It does not share the owner's operational records.

A fresh dataset contains 87 generated operational records and 13 initial menu items across three hardcoded restaurants. Four initial TANJE menu items have no recipe. Two initial Tash items are explicitly marked as illustrative menu examples. All initial stock balances, transactions, prices, reference costs, and recipes are demo inputs. Public-source labels on menu names do not verify recipes, prices, or complete current menu coverage.

The screens named `moveCsv` and `saleCsv` accept pasted lines separated by the pipe character. There is no CSV-file upload, standard quoted CSV parsing, Excel support, data-file export, or spreadsheet template. The PDF action calls the browser print dialog.

The recommended first release is an internal multi-user web application with a transactional PostgreSQL database, server-side business services and authorization, manual entry, validated Excel/CSV imports and exports, auditable stock movements, and management reporting. Direct POS connectivity remains outside release one. An import/service boundary and stable source identifiers should prepare for a later connector.

**Migration conclusion** — Retain the current demo as a read-only design and business-rule reference. Reuse its Persian terminology, layout direction, report concepts, and verified calculation examples. Build the production data, identity, and transaction layers before introducing real operational data. Moving the current static files to another domain alone would retain the demo's browser-storage limitations.

### Immediate decisions needed before implementation

- Confirm restaurant/location ownership and the full verified material and menu catalog.
- Approve the employee permission matrix and separation of purchasing, receiving, and managerial approval.
- Define units, toman/rial conversion, costing, stock-count adjustment, and business-day closure rules.
- Provide representative Excel/CSV source files and required report/export formats.
- Choose the hosting region and operator, identity approach, and recovery objectives.
- Decide whether any real data was entered into individual demo browser profiles and requires a controlled migration.

## 2. Current technology stack

### 2.1 Frameworks, languages, versions, and dependencies

| Area | Observed implementation | Version or qualification |
| --- | --- | --- |
| Frontend framework | None. Direct DOM rendering and event delegation in a classic browser script | No React, Vue, Angular, Next.js, Vinext, or frontend framework dependency |
| Backend framework | None in this repository | No server entry point, HTTP business routes, or backend package |
| Application languages | JavaScript, HTML, CSS, JSON configuration, inline SVG markup | Modern browser JavaScript. No TypeScript or transpilation target |
| Rendering | String templates inserted with innerHTML | All eight views share one document and global application state |
| Styling | Custom CSS, Grid/Flexbox, RTL properties, media queries | No CSS framework or preprocessor |
| Typography | Bundled Noto Sans Arabic Regular and Bold WOFF files | Internal font metadata reports version 2.005 |
| Application dependencies | Browser APIs and bundled fonts | No third-party JavaScript runtime libraries identified |
| Package manager | None declared | No package.json, npm/pnpm/yarn lockfile, or dependency installation step |
| Bundler/build system | None | Files under dist are authored application source and directly served output |
| Browser capabilities | Intl, localStorage, dialog.showModal, structuredClone, crypto.randomUUID, optional chaining | Supported-browser baseline is undocumented. Secure-context support matters for UUID generation |
| Observed audit tooling | Node.js and Python already present in the environment | Node v24.22.1 and Python 3.12.14. These are audit-environment versions, not declared application requirements |
| Hosting | ChatGPT Sites static publication | Provider runtime implementation/version is outside this repository |
| Fonts/license information | Local font-license.txt with Noto attribution and OFL text | Preserve attribution and review redistribution details before release |

No installation command, application start script, automated test script, CI workflow, Dockerfile, database migration, environment-variable contract, or release runbook is present.

### 2.2 Complete file inventory

| Path relative to repository | Size | Responsibility |
| --- | --- | --- |
| dist/index.html | 1,528 bytes | Persian RTL shell, header selectors, navigation container, main content region, modal form, toast |
| dist/app.js | 41,774 bytes, 411 lines | All seed data, state, business calculations, renderers, forms, validation, imports, persistence, events |
| dist/style.css | 11,006 bytes, 15 mostly long physical lines | Theme, layout, responsive states, fonts, tables, forms, print rules |
| dist/font.woff | 88,636 bytes | Regular Arabic/Persian font |
| dist/font-bold.woff | 91,960 bytes | Bold Arabic/Persian font |
| dist/font-license.txt | 5,208 bytes | Font attribution and license notices |
| .openai/hosting.json | 106 bytes | Existing Sites identity and static directory declaration |

Total tracked-file size is 240,218 bytes. Font binaries account for 180,596 bytes. Git metadata records two commits on main. The first contains the complete initial demo. The second changes only app.js, index.html, and style.css for mobile-menu dismissal and accessible state.

The workspace contains tanje-deployment.tar.gz for version 1 and tanje-menu-fix.tar.gz for version 2 outside their repositories. Both contain static assets and packaged manifests. Neither contains a database backup or browser-entered operational data. The previous report is retained in the historical checkout. The audit-transfer-helper folder is auxiliary file-delivery tooling and is not a TANJE runtime dependency.

There are no separate src, components, pages, services, controllers, models, migrations, tests, or public-source assets directories. The apparent dist folder is the complete application source available here. The new audit-latest/PROJECT_AUDIT.md is an assessment document outside the implementation snapshot.

### 2.3 Build and execution commands

| Purpose | Current reality |
| --- | --- |
| Install | No application dependencies or package-manager command defined |
| Build | No build step required for current static files |
| Syntax check | `node --check dist/app.js` succeeded during this audit |
| Local serving | A static HTTP server can serve dist. For example, `python3 -m http.server 8080 --directory dist` would be a temporary developer preview command. It was not started during this audit |
| Managed preview | Existing environment command is `sites-preview start <absolute-project-path>`. Only its read-only status was checked. The relay is currently unavailable |
| Current hosting | Static directory is dist in .openai/hosting.json. Registration, Git synchronization, packaging, and publication are external Sites tooling |
| Production server | None supplied. A future independent application needs a defined application-server process, database migrations, environment configuration, and release procedure |

The demo has no runtime business API dependency. External restaurant/menu URLs are navigation links. Fonts, CSS, JavaScript, and the HTML document are local static assets.

## 3. Architecture overview

### 3.1 Current execution model

The browser loads index.html, style.css, and app.js. The script either deserializes one localStorage value or generates demonstration state. Rendering replaces the sidebar content and main content with HTML templates. Event handlers call client-side functions and persist the entire state after a successful form submission.

| Layer | Current responsibility | Evidence |
| --- | --- | --- |
| Presentation | Eight page functions, shared table/card helpers, dialog forms | app.js lines 119–260 |
| State | Mutable data, restaurant, date, current view, search, sorting, current editor | app.js lines 84–86 and 248–251 |
| Business logic | Balance, receipt differences, recipe consumption, count valuation, imports and validation | app.js lines 71–82, 111–118, 268–352 |
| Persistence | Read/replace one JSON object under tanje-operations-1 | app.js lines 45, 84, 360–380, 410 |
| Infrastructure | Provider serves static directory and controls site-level audience | .openai/hosting.json and current read-only hosting metadata |

### 3.2 Current data shape

| Collection | Contents | Limitations |
| --- | --- | --- |
| menu[restaurant] | Item ID, name, category index, price, recipe map, provenance flags | No effective-date versions, approval, SKU mapping, or lifecycle |
| opening[location][material] | Initial quantities | Synthetic initial balances with no effective date or editable opening-stock workflow |
| records[] | Mixed receipt, transfer, sale, count, and waste rows | Most operational rows have no durable row ID, actor, creation timestamp, revision, or posting status |
| custom[materialId] | Custom material tuple containing name, unit, category, cost, threshold | Optional map, no schema version or material-change history |
| Static constants | Three restaurant IDs, one central warehouse, material defaults, categories, payment names, source links | Restaurant/location administration is absent |

Stock is recomputed by adding receipts to the central warehouse, subtracting central transfers, adding destination transfers, subtracting recipe consumption, and subtracting waste/staff use. Physical counts are observations for reporting. They do not change stock.

A receipt's restaurant field associates the purchase with the selected restaurant for reporting, while its quantity always enters central stock. This distinction must be formalized in the target data model so purchase ownership is not confused with stock location.

### 3.3 Module and component inspection coverage

Every named function group was reviewed.

| Group | Functions or definitions reviewed |
| --- | --- |
| Locale and configuration | $, E, N, D, offset, branches, locations, sources, material, salesTypes, category, defaults |
| Data and calculations | seed, balance, loadState, byDate, sum, round, rec, gross, purchaseGap, missingQty, counts |
| UI primitives | I, btn, badge, unit, money, ref, table, card, info, head, stat, statRow, note |
| Views and analytics | chart, alerts, overview, inventory, distribution, menuPage, breakdown, cash, audit, waste, report |
| Rendering/navigation | pages, views, render, nav, setNavOpen, document click handler, restaurant/date/notification handlers |
| Form builders | label, input, opt, select, options, num, chooseMaterial, chooseItem, desc, dateField, qtyField, reference, formatGuide, forms |
| Form lifecycle | openForm, say, verify, numeric, saleRecord, checkReference, ensureStock, applyEntry, addCustomMaterials, submit handler |
| Other events | Mobile menu toggle, Escape handling, material search, transfer sorting, storage event listener, startup render |

## 4. Complete feature inventory

### 4.1 Classification

- **Implemented locally** means executable behavior exists for the current browser dataset.
- **Partial** means a useful subset exists but required operational capabilities are absent.
- **UI-only** means presentation or navigation is present without the implied business service.
- **Simulated** means data or an identity/status is generated, fixed, or illustrative.
- **Missing** means no implementation was found in the inspected project.

A feature can contain both implemented calculations and simulated starting data. None of the local classifications implies multi-user production readiness.

### 4.2 Global shell and navigation

| Feature | Status | Actual behavior and limit |
| --- | --- | --- |
| Persian RTL interface | Implemented locally | HTML lang/dir, Persian labels, Persian number formatting, Tehran-based current business date |
| Restaurant selection | Implemented locally, partial | Switches among three hardcoded restaurant datasets. Every visitor can select every restaurant |
| Date selection | Implemented locally, partial | Filters reports by date. Display uses Persian locale while native date input stores ISO Gregorian dates |
| Page navigation | Implemented locally | Eight in-document views. No URL router, deep-link state, or browser-history integration |
| Notification icon | UI-only notification service, implemented navigation | Red dot is computed from current-date discrepancies. Clicking opens the audit view |
| Header avatar | Simulated identity | Fixed Persian letter. No logged-in TANJE employee profile |
| Mobile sidebar | Implemented dismissal locally, partial browser verification | Dedicated backdrop, repeated-toggle close, navigation close, Escape close, synchronized expanded state/label, and trigger-focus return for outside/Escape. Real touch and responsive acceptance remain unverified |
| Toasts, empty states, validation messages | Implemented locally, partial | Form errors and storage-quota message exist. No global recovery boundary or monitoring |

### 4.3 Eight screens

| Screen | Implemented behavior | Partial, simulated, or missing behavior |
| --- | --- | --- |
| Overview — overview() | Selected-day sales, receipt count, transfer-row count, discrepancy count, seven-day sales bars, issue list, last six receipt/transfer rows | Seeded operational figures. No all-restaurant KPI overview, drillable ledger, trend range selector, or live operational feed. Purchase/transfer counters count rows rather than unique documents |
| Inventory and purchasing — inventory() | Material search, category, central/destination calculated balances, low-stock badge, receipt comparisons, add-material and receipt dialogs | Hardcoded locations and opening stock. No batch/expiry, supplier master, purchase-order approval, valuation ledger, stock-opening document, attachments, material edit/archive, or receiving separation |
| Distribution — distribution() | Manual central-to-restaurant transfer, pasted multi-destination import, current-day rows, name/quantity sorting, all-three-restaurant material matrix | Quantity sorting groups units then sorts quantity. “Recent” retains insertion order. No dispatch/receipt confirmation, in-transit stock, returned delivery, partial receipt, branch-to-branch transfer, or material conversion |
| Menu and portions — menuPage() | Per-restaurant menu, category, price, recipe quantities, item creation/editing, missing-recipe badge, source links | Initial menu catalog is incomplete and partially illustrative. No recipe effective dates, approval, recipe yield/prep loss, modifier recipes, sub-recipes, SKU codes, archive/delete, or authorized price changes |
| Daily cash — cash() | Manual sales lines, pasted sales import, gross sales, item quantity, average value per item, prior-day comparison, category/payment breakdown, line list | No sale header or customer bill, order count, split payment, reconciliation against actual till/card deposits, tax, discount, service charge, refund, void, shift closure, or POS service |
| Discrepancies — audit() | Quantity mismatch, budget difference, count comparison, estimated shortage value, headcount division | Purchasing and receiving share one form. No approval case workflow, supporting evidence, staff roster allocation, payroll posting, actual account deduction, or stock-adjustment posting |
| Waste and staff meals — waste() | Separate waste/staff-use classifications, quantity-based stock deduction, reference-cost totals, required reason | No waste lifecycle, salvage lot, meal production, per-person meal issue, formal approval, yield, or inspection record |
| Employer report — report() | Selected-restaurant/date summary, sales mix, highest-selling category, issue list, budget remainder, waste/staff reference values, print action | Rule-based deterministic summary. No AI analysis, automated delivery, scheduled report, consolidated organization report, profit/loss, inventory valuation, dedicated PDF renderer, Excel or CSV export |

The sales metric called an average is calculated per item quantity. It cannot represent average bill value because the data has no bill/order header. Payment labels classify recorded sales lines. They are not evidence that funds were actually collected.

The staff-meal screen records a quantity of raw material consumed as staff use. It does not model a process that converts an existing waste record into prepared staff meals. Recording the same physical material as both waste and staff consumption would deduct it twice.

### 4.4 Nine entry workflows

| Form/workflow | Status | Validation, effects, and gaps |
| --- | --- | --- |
| receive | Implemented locally, partial | Date, material, purchased quantity, delivered quantity, price, budget, documented other amounts, reference, note. Delivered quantity increases central stock. Ordered-versus-delivered and budget differences are calculated. Zero delivery is allowed. One user supplies all values |
| move | Implemented locally, partial | Adds one central-to-selected-restaurant movement. Checks reference and stock availability. Dispatcher description is free text. No second-person receipt |
| moveCsv | Implemented pipe-text importer, missing CSV-file support | Five pipe-separated columns for material name, destination name, quantity, reference, description. Exact-name lookup. One date for entire batch. Up to 500 nonblank lines |
| sale | Implemented locally, partial | Requires an item with a nonempty recipe, integer positive quantity, integer toman price, recognized payment label, unique reference. Recipe copied onto new sale record. Deducts materials |
| saleCsv | Implemented pipe-text importer, missing CSV-file support | Five pipe-separated columns for item name, quantity, price, payment, unique line reference. Matches exact item name in selected restaurant. Uses recipe at import time |
| count | Implemented locally, partial | Material, physical quantity, staff count, date, note. Replaces previous same-material/restaurant/day count. Does not adjust inventory |
| waste | Implemented locally, partial | Material, quantity, waste/staff classification, required explanation. Deducts selected-restaurant stock. Cost estimate uses configured material reference cost |
| material | Implemented locally, partial | New name, one of three units, free-text category, reference cost, threshold. Initializes zero opening quantity at all locations. No edit/retire workflow |
| recipe | Implemented locally, partial | Creates or replaces menu item and recipe. Exact duplicate names rejected within restaurant. Empty recipe is permitted at save but rejected when selling |

The source contains **nine form definitions** — receive, move, moveCsv, sale, saleCsv, count, waste, material, and recipe. The eight-screen count is independent of the form count.

### 4.5 Cross-cutting operational behavior

| Capability | Status | Evidence or limit |
| --- | --- | --- |
| Reference duplicate prevention | Implemented locally, partial | Sales unique by type/restaurant/date/reference. Receipts and transfers add material to that comparison. No database uniqueness or server idempotency |
| Batch all-or-nothing persistence | Implemented locally, partial | Submit handler clones state and writes only after applyEntry completes. A rejected batch may mutate the temporary clone, which is then discarded |
| Backdated stock checking | Implemented locally, partial | Validates end-of-day balances for affected locations from posting date through later recorded dates |
| Intraday stock ordering | Missing | Rows have dates but no transaction times. Net-positive day balances can mask negative stock earlier that day |
| Recipe snapshot on new sale | Implemented locally | Later recipe replacement does not rewrite prior sale consumption |
| Reference costing | Simulated baseline, implemented arithmetic | Shortage, waste, and staff costs use fixed/default or custom-material reference cost, not acquisition layers or weighted average |
| Mobile-menu dismissal | Implemented locally, event logic verified | Separate backdrop and setNavOpen synchronize open/hidden and accessible state. Fresh real-device touch acceptance remains outstanding |
| Same-origin tab refresh | Partial | Storage event reloads another tab's value. There is no locking, revision check, or conflict resolution |
| Standard CSV and Excel import/export | Missing | Pasted pipe parser only. No files, quoted fields, workbook parser, templates, mapping preview, export writer, or import history |
| Print-to-PDF | Implemented browser feature, partial output workflow | window.print plus print CSS. PDF destination depends on browser/OS |
| Employee login and role access | Missing | Provider site audience is separate from internal employee capabilities |
| Immutable audit history | Missing | Most operational rows lack row IDs, actor/time, posting state, reversals, approval, and prior-count retention |
| Automatic employer alerts | UI-only/local alerts | No outbound messages, email, push, job scheduler, or report delivery |
| Payroll deduction | Missing | Only proposed shortage share is displayed. No account ledger or payroll integration |
| Branch/location administration | Missing | Hardcoded branch/location configuration |
| POS integration | Missing, correctly outside release one | No connector, API client, webhook, mappings, inbox, retry log, or integration contract |

## 5. Database and backend assessment

### 5.1 Direct answers

| Question | Finding |
| --- | --- |
| Is there a real application backend? | No. The hosting service delivers static assets and applies its own site-access gate |
| Is there a real application database? | No. No SQL/NoSQL server, ORM, schema, migration, IndexedDB store, or database binding |
| Where is data stored? | In memory, and after a successful submission as one JSON localStorage value |
| Does data survive refresh? | Successfully saved state normally survives same-origin refresh in the same browser profile. Fresh seed is not persisted merely by loading the page |
| Does data survive a browser/device restart? | Normally saved localStorage survives ordinary browser restart, subject to browser policy and user clearing. It does not transfer to another device/profile or a new domain |
| Does provider restart/redeployment restore records? | Business records are not stored on the provider. Same-origin assets may reload while browser state remains. The provider archive cannot restore local operational data |
| Is authentication implemented? | Hosting-level ChatGPT audience access exists. There is no TANJE login/session implementation or employee identity inside the application |
| Are roles implemented? | No application RBAC or location-scoped authorization |
| Are business APIs functional? | No business endpoints or network API calls exist in this code. Local JavaScript functions execute in the browser |

localStorage is origin-scoped browser persistence and can be unavailable due to browser settings. It is unsuitable as an organization-wide authoritative database. The related browser behavior is documented by MDN. [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### 5.2 Persistence and integrity failure modes

1. A new origin receives a new storage namespace. Copying the website to an independent domain does not copy existing browser records.
2. Startup silently replaces unreadable JSON/storage-access failures in memory with demo seed. The corrupt stored string is not repaired. A subsequent submit attempts to parse it again and fails.
3. JSON that parses but has an incorrect shape is accepted without schema validation. An in-memory startup check with an empty object produced a TypeError.
4. There is no explicit data-version migration. The suffix in the storage key is not an implemented migration mechanism.
5. Different people using different devices cannot share stock, receipts, counts, or report history.
6. People using the same browser profile and website origin share its stored state regardless of which TANJE employee should own or access it. Provider sign-in is not an employee partition in the local key.
7. Every save reads and rewrites the full document. Separate tabs can read the same old value and overwrite each other's changes. The storage event refreshes UI state but does not serialize writes.
8. Counts replace earlier counts for the same material, restaurant, and date. Previous evidence is discarded in the saved document.
9. No stock reconciliation is posted after an approved count. Later stock continues from the original ledger arithmetic.
10. No generic reversal, refund, correction, soft deletion, period lock, or operational-document amendment workflow exists.
11. No structured export or restore route exists. Clearing browser storage loses the only saved copy.
12. Stored and imported data is not checked against a full schema. Some constraints exist only on HTML controls.

### 5.3 Business-rule accuracy findings

- **Unanchored opening balances** — Opening quantities have no date and apply even to historical queries before the generated transaction period.
- **Count reference moves over time** — Expected stock is recomputed at the end of the count's date. Later entries backdated to that date change the displayed variance. No immutable counted-at ledger boundary exists.
- **Date granularity** — End-of-day validation permits a sale or transfer to rely on receipts later in that same date. Ordering by actual event time is impossible.
- **Receipt attribution** — Purchasing amounts are grouped by restaurant while inventory lands centrally. Ownership/allocation must be explicit in production.
- **Receipt accounting** — The remainder equals budget minus delivered quantity times price minus “other” amounts. The other amount has no linked proof, payee, document, or approval.
- **Financial interpretation** — A positive budget remainder is an unresolved reconciliation amount. The application cannot establish intentional wrongdoing or an enforceable employee debt from this calculation.
- **Cost basis** — Count and waste valuation is a reference estimate. Receipt prices do not update material cost or compute inventory value.
- **Precision** — Quantities and prices use JavaScript Number. Numeric entry accepts values up to 10^12, allowing products and totals beyond safe integer precision. Balance rounding to six decimals does not provide fixed-decimal accounting.
- **Units** — Counted materials measured in “number” can still accept fractional quantities. No unit conversion, density conversion, pack size, or dimension validation exists.
- **Catalog revisions** — Historical sales retain consumption snapshots, which is useful. Historical menu provenance, approval, price periods, and recipe effective-date selection are absent.
- **Seed isolation** — Seed records and later user entries share the same collections. Record-level provenance is not consistently modeled, and fresh seed uses today's date each time it is regenerated.

### 5.4 Read-only behavioral verification results

| Check | Result |
| --- | --- |
| JavaScript syntax | Passed with Node --check |
| All eight page renderers for all three restaurants with seed data | 24 combinations generated markup |
| Same 24 renderer combinations with empty operational records | Generated markup without exceptions |
| Seed coverage | 87 records, 13 items, 4 empty initial TANJE recipes |
| Receipt, transfer, and sale stock calculation | A 10-unit receipt persisted through the actual submit handler in isolated stub storage. A subsequent 5-unit transfer and two 0.22-unit recipe sales increased restaurant stock by 4.56. Central transfer behavior and a 1,900,000-toman receipt budget remainder were verified |
| Recipe edit after sale | Prior sale retained 0.22 per unit while updated recipe became 0.5 |
| Pipe import and duplicate reference | One row added. Repeat rejected |
| Standard comma-separated row | Rejected because parser expects five pipe-separated fields |
| Failed duplicate row inside batch | Rejected by actual submit handler. Stub storage bytes and write count remained unchanged |
| Recount | Replaced prior same-day count. No stock reconciliation |
| Same-day event ordering | Current source confirms date-only end-of-day replay. The earlier acceptance demonstration remains applicable because balance and ensureStock are unchanged |
| Invalid JSON startup | Fell back to unsaved seed |
| Parseable malformed state | Startup TypeError |
| Saved-state rehydration | Serialized seed could be reloaded and all views rendered |
| Publication archives | Both archives have seven regular files matching their respective checkouts |
| Form builders | All nine form builders generated markup for all restaurants, 27 combinations |
| Menu event handlers | Outside click, repeated toggle, Escape and section navigation closed the menu and synchronized expanded state in isolated checks |

Current isolated verification passed ten grouped checks, including 24 seeded page/restaurant combinations, 24 empty-ledger combinations, 27 form/restaurant markup combinations, actual submit-handler persistence and rejection, stock and catalog workflows, invalid storage, and menu event/state logic. No test files or dependencies were added.

## 6. Security assessment

### 6.1 Current controls and limitations

The source implements an HTML escaping helper for common template inputs, numeric normalization for Persian/Arabic digits, several required-field/range checks, source links using rel=noopener, dialog labels, duplicate-reference checks, and shortage rejection for selected operations. These are useful local controls.

A targeted source scan found no high-confidence API key, private-key, cloud-key, or token patterns in the tracked application text. This is a scoped observation, not a complete secret-history or infrastructure audit. No secret values or provider-issued credentials are included in this report.

Hosting metadata was read through the existing authorized connection and reduced to non-sensitive status fields. Provider authentication material was neither written to the report nor used to change access.

| Finding | Severity for internal production | Explanation |
| --- | --- | --- |
| No server authorization or branch isolation | Critical blocker | Every accepted visitor sees every function and can select every branch. Client controls do not establish employee permissions |
| User-controlled authoritative state | Critical blocker | Inventory, costs, recipes, and reports can be edited through browser storage/tools. No trusted server can validate authenticity |
| Single-browser sensitive business storage | High | Same-origin scripts can read it. There is no application-managed encryption, retention, remote revocation of local copies, or user partition |
| No actor/audit evidence | High | Business records cannot establish who created, received, approved, or altered a document |
| Weak persistence recovery | High | Corruption can produce a crash or a confusing return to demonstration state |
| No shared transaction boundary | High | Cross-tab/device concurrency cannot maintain consistent stock or uniqueness |
| Incomplete structured validation | High | HTML restrictions can be bypassed. Material IDs, category bounds, units, dates, enums, lengths, and stored schema need trusted validation |
| No session lifecycle in application | High for independent hosting | Employee login, deactivation, password recovery or SSO, session expiry, and MFA policy are absent |
| Security headers undefined in source | Unverified infrastructure control | No repository-owned CSP/header configuration. Existing provider headers were not assessed |
| innerHTML template rendering | Hardening requirement | Escaping is used in many paths, but stored values are trusted in some interpolations. No finding of a remotely exploitable XSS through the normal form flow is asserted |
| Request protections | Required in target | There are no application API requests to secure today. The target must add CSRF protection for cookie sessions, rate limits, and request/body limits |
| Resource exhaustion | Medium | Huge JSON, many records/materials, or expensive replays can block the browser. The 500-line limit is not a byte-size or total-history limit |
| Dependency governance | Missing release control | Current runtime library surface is small, but target dependencies need pinning, updates, license review, and vulnerability checks |

OWASP advises against keeping sensitive data or session identifiers in localStorage and requires treating client-side stored values as untrusted. This supports replacing browser-authoritative business records with authenticated server persistence. [OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

### 6.2 Security requirements for the first production release

Use organization-controlled identities and server-enforced restaurant/location membership. Deny access by default and verify authorization for every read, write, import, export, and approval. Apply equivalent controls to list endpoints, individual documents, and file downloads. UI hiding alone is insufficient. [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

Protect sessions with secure HTTP-only cookies, appropriate same-site behavior, TLS, expiry, and CSRF validation. Require stronger authentication for privileged users according to TANJE's identity policy. Keep credentials in deployment secret management. Use database service accounts with limited privileges.

Validate imports before posting, control file type/size/rows, reject unsupported workbook features, and handle spreadsheet formula-like text safely on export. Record audit events, approval identity, and failed authorization attempts without logging credentials or unnecessary employee data.

Treat any future employee financial deduction as a separate, explicitly authorized workflow with evidence, review, correction, and policy sign-off. The current headcount division is an estimate displayed to a manager. It provides no payroll or account-posting implementation.

## 7. Production-readiness score

**Overall score — 25 / 100.**

This is an engineering gate assessment for an independent internal multi-user release. It is not a measured reliability statistic or a percentage of development work completed. A deployable static demo and a production operations system have different requirements.

| Dimension | Available points | Awarded | Justification |
| --- | --- | --- | --- |
| Business operations and reporting | 20 | 9 | Eight screens and meaningful local workflows, with major document, reconciliation, and approval gaps |
| Shared data integrity and persistence | 20 | 3 | Local arithmetic, recipe snapshots, duplicate checks, and clone-before-save exist. No shared database or durable transaction controls |
| Identity, authorization, and security | 20 | 2 | Provider audience gate and basic escaping/validation. No TANJE auth, RBAC, trusted server, or attributable audit |
| Import/export and interoperability | 10 | 1 | Limited pasted pipe text. No Excel, standard CSV files, exports, or stable import contract |
| Maintainability and verification | 10 | 2 | Small inspectable source and valid syntax. One mixed-responsibility script, no committed tests, typing, CI, or documented runtime contract |
| User experience, responsiveness, accessibility | 10 | 6 | Persian RTL, consistent styles, responsive rules, labels, focus styling, and empty states. Browser acceptance and print QA remain unverified |
| Deployment, operations, and recovery | 10 | 2 | Static publication and source archive exist. No production service configuration, backups, monitoring, restore drill, or runbook |
| **Total** | **100** | **25** | **Production approval blocked by shared data, authorization, and operational integrity** |

The menu fix resolves a specific usability defect while leaving the score unchanged under this coarse rubric. Full mobile/accessibility acceptance remains outstanding.

### Additional quality assessment

| Area | Evidence | Production implication |
| --- | --- | --- |
| Error handling | Submit try/catch, specific quota error, row parse messages | Startup, storage-event parsing, malformed schema, and renderer errors lack global recovery |
| Performance | Small static assets, local fonts, no framework download | Synchronous full-state parse/serialization and repeated full-ledger scans grow with history |
| Worst-case balance validation | Affected locations multiplied by later record dates multiplied by ledger replay | Can approach quadratic work in record count when dates grow with records |
| Table scalability | No pagination or virtualization | Large receipt, sales, count, and material tables can block rendering |
| Mobile layout | 1020px and 760px breakpoints, table scrolling, mobile sidebar | Actual 320–430px layouts and touch/keyboard operation remain untested |
| Accessibility | RTL language, skip link, main focus target, labels, table headers, role=status/alert, native dialog | Contrast, zoom/reflow, accessible chart alternative, focus return, and screen-reader behavior need verification |
| Mobile state | Current commit closes on outside click, navigation, repeated toggle, and Escape with synchronized expanded state | Previous dismissal defects are resolved at code/event level. Real touch, breakpoint transitions, focus order and reflow need acceptance checks |
| Date behavior | Persian display and native Gregorian input | Jalali input expectations, shift rollover, and invalid/extreme dates require a defined policy |
| Browser compatibility | Modern APIs used without fallbacks | Establish and test supported browser versions |
| Backup/recovery | Git and archive preserve code only | No operational data backup or application restore |
| Observability | No structured logs, request IDs, health checks, or error telemetry in application | Operational failures cannot be diagnosed centrally |
| Scalability | Every client holds all local state | No multi-user consistency, query indexes, or report isolation |

## 8. Missing requirements for TANJE release one

### 8.1 Required business scope

| First-release requirement | Current position | Required completion |
| --- | --- | --- |
| Manual entry | Useful local subset | Authenticated server forms, trusted validation, document IDs, drafts/posting, corrections, permissions |
| Excel import | Missing | XLSX templates, parser, preview, validation, error download, safe posting, import history |
| CSV import | Missing standard file workflow | UTF-8/BOM handling, documented delimiter and quote behavior, Persian text/digit normalization, column mapping, stable code matching |
| Excel/CSV export | Missing | Authorized filtered exports with metadata, units, currencies, safe cell handling, and row/total reconciliation |
| Restaurant operations | Partial | Shared catalogs, purchase/receipt separation, stock ledger, counts/adjustments, transfers, sales, waste, staff use, approvals |
| Management dashboards/reporting | Local selected-day subset | Shared trusted data, date ranges, consolidated branch overview, meaningful report definitions, reproducible report outputs |
| Employee roles/permissions | Missing | Server-side role and location assignments, employee onboarding/deactivation, separation of duties |
| Future POS preparation | Missing | Versioned operations API, internal item identifiers, external code mappings, source metadata and idempotency |
| Direct POS connectivity | Outside release one | Preserve as a later phase. No live POS credential, webhook, or synchronization work in release one |

### 8.2 Data and operating decisions

The production requirements must define opening-balance dates, physical-count cutoff, adjustment approval, purchase ownership versus delivery location, full versus partial delivery, supplier identity, stock-return rules, branch transfer states, and item retirement.

Quantities need base units and allowed precision. Currency must be explicit on inputs, outputs, and imported rows, including the conversion between toman and rial. Costs require an approved method such as weighted average and an effective date. Sales need order/line identifiers, business date, channel, refunds/voids, and any required discount/tax treatment.

Reports need definitions for gross/net sales, order versus item counts, budget remainder, shortage value, staff consumption, and close-of-day. An import or backdated correction should not silently rewrite a signed-off report.

Operational records need actor, timestamps, source, revision, posting status, supporting document references, and approval history. Approved corrections should create traceable reversals or adjustments.

### 8.3 Suggested employee permission matrix for approval

This matrix is a target proposal. None of these internal roles currently exists.

| Role | Intended scope | Permitted responsibility | Approval separation |
| --- | --- | --- | --- |
| Organization administrator | Organization | Manage identities, role/location assignments, system configuration | Sensitive changes logged. Routine business approvals remain explicit |
| Owner / operations director | Organization or assigned restaurants | Consolidated reports, discrepancy review, material/recipe policy approvals | Approve material stock adjustments and approved financial cases |
| Purchasing officer | Assigned purchasing scope | Create purchase request/order and budget/price records, attach supplier evidence | Cannot confirm own independent receipt by default |
| Central warehouse operator | Assigned warehouse | Record delivered quantities, stock counts, dispatch proposals, waste observations | Cannot change purchase budget or approve own material variance |
| Dispatcher / distribution operator | Assigned route/locations | Prepare dispatch documents and record delivery references | Destination receiver confirms received amount |
| Restaurant manager / receiver | Assigned restaurant | Confirm deliveries, submit counts/waste/staff use, review restaurant dashboard | Approves within delegated limits, escalates unresolved variance |
| Kitchen supervisor | Assigned restaurant | Propose recipe portions, record production use/waste/staff meals | Approved recipe or adjustment changes require authorized reviewer |
| Cash/reporting operator | Assigned restaurant | Enter/import sales, reconcile daily payment totals, submit close | Cannot change stock-cost rules or financial allocations |
| Auditor / employer viewer | Assigned reporting scope | Read reports and evidence, export within scope | No posting or editing permission |

Roles can be combined for small teams only through an approved policy. Restaurant scope must be enforced on the server even when a user changes an ID manually. Purchase approval, physical receipt, and stock adjustment should remain independently attributable.

## 9. Deployment options

No option was deployed, priced, or selected during this audit. Hosting region, employee connectivity, data-residency requirements, identity access, and support ownership remain decisions for TANJE.

| Option | Suitable use | Advantages | Requirements and risks |
| --- | --- | --- | --- |
| Managed application platform plus managed PostgreSQL and object storage | Recommended initial independent-production candidate | Lower database/backup operating burden and clear service separation | Verify regional availability, restore capability, network/private DB access, exportability, quotas, and provider support |
| Organization-controlled VM with reverse proxy, application containers, PostgreSQL, and backup storage | Appropriate where TANJE has a named operations owner or regional-hosting requirement | Direct control of domain, network, software, and maintenance | TANJE/operator owns patching, monitoring, capacity, backup integrity, security configuration, and recovery |
| Internal network or private-access hosted application | Appropriate when access must be restricted to corporate devices/network | Narrower access boundary and integration with internal identity | Plan staff remote access, connectivity between branches, reliable certificates/DNS, and offsite recovery |
| Static hosting of current dist only | Suitable for preserving the demo or a temporary presentation | Minimal changes to deliver the existing interface | Does not satisfy shared data, identity, roles, backup, or production operations |
| Split frontend and serverless API with managed SQL | Feasible alternative after platform evaluation | Independently scalable static delivery and request handlers | Validate database transaction behavior, connection management, import runtime limits, background tasks, and identity boundaries |

### Minimum independent deployment requirements

- Organization-owned domain, DNS, TLS, and a stable production origin.
- Separate development, staging, and production settings and databases.
- Reproducible release artifact and pinned dependencies, with no production secrets in source.
- Application server, reverse proxy or managed ingress, protected database connectivity, and object storage if imports/evidence are retained.
- Database migration process and migration rollback/forward-recovery procedure.
- Identity bootstrap, first administrator setup, scoped roles, and session controls.
- Health/readiness checks, structured application/security logs, error monitoring, and storage/capacity alerts.
- Automated encrypted backups, defined retention, point-in-time recovery where available, and tested restore.
- Operator runbooks, escalation contact, maintenance ownership, release rollback, and an agreed recovery objective.
- Approved data migration and operational cutoff, with rollback criteria before live entry.

The current Sites manifest should remain preserved with the demo. Its provider project identity is not an independent application's backend configuration.

## 10. Recommended target architecture

### 10.1 Proposed technology direction

Use a **modular monolith** for the initial internal release, with one authoritative transactional database and explicit business-service boundaries.

| Layer | Proposed implementation | Rationale and qualification |
| --- | --- | --- |
| Frontend | React with TypeScript and a lightweight build tool such as Vite | Supports maintainable typed forms, shared components, routing, and API contracts. Carry forward Persian RTL styling and vocabulary |
| Backend | Django with Django REST Framework | Suits administrative operations, migrations, sessions, validation, authorization extension, and testable business services |
| Database | PostgreSQL | Relational integrity, decimal fields, unique constraints, transaction support, indexed reporting |
| Identity | Organization SSO via OIDC when available, otherwise controlled employee accounts with a defined recovery/MFA policy | Select based on TANJE's actual identity environment |
| Session model | Same-origin server sessions with secure cookies and CSRF validation | Keeps browser credentials outside localStorage |
| File handling | Validated server-side CSV/XLSX parsing and export, private object storage for retained uploads/evidence | Centralizes validation, audit, permissions, and report consistency |
| Background work | Small job worker when needed for large imports, exports, notifications, or report generation | Keep job state in durable storage. Add a broker only when actual workloads require it |
| Monitoring | Structured logs, error telemetry, database/job health checks | Central diagnosis and accountable operations |

These are architectural recommendations, not existing dependencies or an instruction to install them. Final supported framework versions, library licenses, and patch levels must be verified and pinned when implementation is approved. A team with strong expertise in another maintained backend framework can satisfy the same boundaries. The critical migration requirements are authoritative persistence, trusted transactions, scoped permissions, and auditable documents.

Django REST Framework provides permission hooks, while restaurant scoping and document-specific authorization require explicit implementation and tests. Its object-permission checks also do not automatically secure every list or creation path. [DRF permissions](https://www.django-rest-framework.org/api-guide/permissions/)

### 10.2 Logical modules

| Module | Responsibility |
| --- | --- |
| Identity and organization | Employees, role grants, restaurant/location assignments, account lifecycle |
| Catalog | Materials, units, conversion policies, menu items, item codes, recipe versions |
| Purchasing and receiving | Purchase documents, budgets, suppliers, independent receipts, reconciliation |
| Inventory | Posted stock ledger, openings, balances, counts, adjustments, costing |
| Distribution | Dispatch, in-transit, receipt confirmation, shortage/return workflow |
| Sales | Manual/imported sale documents, lines, payment summaries, void/refund/reversal |
| Waste and staff consumption | Observed waste, approved disposal, safe staff-use issue, attributable reasons |
| Reporting | Scoped dashboards, date ranges, consolidated summaries, reproducible exports |
| Import/export | Templates, staging, validation, commit, deduplication, error files, export audit |
| Integration boundary | Versioned command contracts, source metadata, external identifier mapping, future adapter interface |

### 10.3 Proposed database entities

| Domain | Principal entities | Required integrity |
| --- | --- | --- |
| Organization | Organization, Restaurant, StockLocation | Distinguish reporting restaurant, central warehouse, and physical location |
| Identity | Employee/User, RoleGrant, LocationMembership | Server-enforced assignment and deactivation |
| Catalog | Material, Unit, MenuItem, RecipeVersion, RecipeLine | Stable IDs, allowed precision, effective versions, item/material references |
| Procurement | Supplier, PurchaseDocument, PurchaseLine, BudgetAllocation, GoodsReceipt, ReceiptLine | Independent actors, received-versus-ordered quantities, approved budget evidence |
| Stock | StockDocument, StockMovement, StockBalance, StockCount, CountLine, StockAdjustment | Posting timestamps, business dates, status, unique source references, authorized reversals |
| Transfers | Transfer, TransferLine, DispatchConfirmation, ReceiptConfirmation | Source/destination, partial receiving, in-transit and variance status |
| Sales | SaleDocument, SaleLine, PaymentSummary, Reversal | Recipe/version snapshot, currency, stable order/line IDs, source metadata |
| Waste/staff use | ConsumptionDocument, ConsumptionLine, Reason, Approval | No double deduction of the same physical issue |
| Data exchange | ImportBatch, StagedRow, RowError, ExportJob, ExternalMapping | File checksum, mapping/version, idempotency, submitter and completion history |
| Accountability | Approval, AuditEvent, PeriodClose, Attachment | Attributable actions and immutable evidence linkage |

Retain a single organization scope for the first release while enforcing restaurant/location access. Avoid unnecessary multi-tenant product features. Database foreign keys, check constraints, and unique keys must back critical application rules.

Use exact decimal types for material quantities and a documented integer or decimal currency convention. Costing must be explicitly chosen. Store UTC event timestamps separately from the Tehran business date. Generate Persian calendar display at the UI boundary.

### 10.4 Posting and concurrency model

1. Accept a draft command with authenticated actor, location scope, business date, expected document revision, and idempotency key.
2. Validate references, allowed units, totals, applicable recipe version, permissions, document status, and period closure.
3. Open a database transaction. Acquire appropriate row locks or use another explicitly tested isolation strategy for affected stock/document rows.
4. Post document, stock movements, balance updates, and audit evidence together.
5. Enforce database uniqueness for source identities and command idempotency. A retry returns the prior result or a clear conflict.
6. Return committed document IDs and a correlation ID. Separate optional report/email jobs through a durable job/outbox record if needed.
7. Correct posted documents through linked reversals and authorized replacement/adjustment documents.

PostgreSQL's default isolation level is not an automatic solution to all concurrent stock invariants. Locking or stricter isolation with retry behavior must be deliberately designed and verified. [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

### 10.5 Excel/CSV first-release design

Provide named, versioned templates for material/catalog loading, receipt lines, dispatch lines, sales lines, counts, and any agreed operational imports. Use material/item codes and location codes as canonical identifiers, with human-readable names as confirmation.

The import workflow should upload, stage, validate, preview totals and errors, obtain user confirmation, and commit through the same services as manual entry. Define whether valid rows may be posted when others fail. Recommend atomic posting per operational document, with an explicit batch outcome and no silent partial commits.

Support Persian characters, Persian and Arabic digits, UTF-8 CSV with BOM where needed, quoted delimiters/newlines, empty rows, date/currency conversion, and clear type/precision rules. File parsing must not execute formulas or macros. Detect repeated file and business-row imports using documented source keys.

Exports should honor employee/restaurant permissions and include selected filters, date range, timezone/business date, currency, units, stable IDs, generation time, and totals. Test formula-like text handling and round-trip behavior against representative TANJE spreadsheets.

### 10.6 Future POS preparation

Release one should store source_type values such as manual and file_import, source_system, external_document_id, external_line_id, imported_at, and schema version. Allow nullable external identifiers for manually created records and enforce uniqueness when source identities are present.

Document a versioned sales-command contract and an item-code mapping model. Preserve raw import provenance with restricted retention. Recipe consumption, refunds, and duplicates must be handled by the same domain services whether a later source is a file or a POS adapter.

Direct POS authentication, webhooks, polling, vendor SDKs, live synchronization, and production connector operation are deferred. No first-release dependency on live POS availability is required.

### 10.7 Existing demo data migration

- Inventory which users/devices contain real local entries. A server-side source archive cannot provide those records.
- With approval, add a controlled extraction process in a later implementation phase. No extraction feature was added in this audit.
- Retain an original snapshot and checksum for each contributed browser dataset.
- Separate generated data from operational entries with human verification. Seed provenance is incomplete, so automated date/reference filtering alone is insufficient.
- Map materials, menu items, restaurants, units, and currency to approved master records.
- Validate transaction totals, source duplication, opening balances, physical count cutoffs, and recipe assumptions before loading.
- Pilot one restaurant, reconcile approved opening stock and daily figures, and sign off a cutover date.
- Preserve the old demo for reference through the agreed retention period. Avoid silently reusing synthetic balances as production openings.

### 10.8 Backup, recovery, and release operations

Set recovery time and recovery point objectives with TANJE before selecting service tiers. Use automated database backups and point-in-time recovery where available, private encrypted file storage, separate credentials, backup retention, and documented restoration procedures. Test restoring both database and import/evidence files into staging before production approval.

Git history, a tar archive, CSV exports, and database backups preserve different assets. Exports are useful for business portability but do not replace a full database recovery strategy. PostgreSQL documents logical dumps, physical backups, and continuous archiving as separate approaches. [PostgreSQL backup and restore](https://www.postgresql.org/docs/current/backup.html)

Apply framework-specific production checks, disable development diagnostics, configure trusted hosts/proxy behavior and secure sessions, and keep deployment secrets outside source. Validate each release in staging before migration and production rollout. [Django deployment checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)

## 11. Risks and technical blockers

| Priority | Risk or blocker | Consequence | Required resolution |
| --- | --- | --- | --- |
| P0 | Browser-local authority and no shared database | Restaurants disagree on balances and employer sees unrelated demo/local state | Introduce authoritative backend/database before live operations |
| P0 | No employee authentication, restaurant scope, or permissions | No trustworthy separation of operational duties or data access | Implement identity, role/location assignments, server checks, and authorization tests |
| P0 | Synthetic seed mixed with editable records | Misleading financial and inventory reports | Separate demo environments, approve catalogs/openings, verify migration provenance |
| P0 | Missing exact-decimal transaction and concurrency controls | Overselling, duplicate postings, lost updates, inaccurate amounts | Transactional posting with database constraints, locks/isolation, safe arithmetic, and retry rules |
| P0 | No recovery strategy | Loss of business data after browser clearing or operational failure | Database/file backups with tested restore and named ownership |
| P1 | No CSV/XLSX file workflow or export | First-release requirement unmet | Implement staging, templates, validation, audited posting and scoped exports |
| P1 | No independent purchasing/receiving workflow | Quantity and budget comparisons lack accountable source evidence | Separate documents, actors, timestamps, approvals, and supplier evidence |
| P1 | Recount replacement and moving comparison basis | Variances cannot be reproduced reliably | Preserve count revisions/cutoffs and approve stock adjustments |
| P1 | Undefined costing, units, and currency | Disputed shortage, waste, and sales figures | Approve domain rules and implement exact arithmetic/conversion |
| P1 | No document correction, returns, voids, or period close | Incorrect postings cannot be corrected transparently | Linked reversals, review workflow, accounting/period rules |
| P1 | No current browser/print/accessibility verification | Poor employee usability or report output may survive migration | Real-browser acceptance at mobile/desktop sizes and assisted-access testing |
| P1 | No CI, automated domain tests, or runbooks | Regressions and unsafe releases | Reproducible checks, deployment gates, monitoring and recovery runbooks |
| P2 | Hardcoded catalog and weak identifiers | Import errors and branch growth require code edits | Master data administration and stable codes |
| P2 | Dense single-file implementation | Larger changes become harder to reason about and verify | Refactor only after approval, with domain boundaries and behavior preservation |
| P2 | No future integration contract | Later POS connection requires invasive rework | Stable source metadata and service/API contracts in release one |

### Unresolved information and verification boundaries

The audit did not access employees' actual browser datasets, TANJE identity infrastructure, purchase evidence, sample Excel files, payroll policy, expected transaction volume, hosting contracts, or recovery requirements. Current menu completeness and brand asset ownership were not independently revalidated. Restaurant/source links in code are evidence of attribution, not a maintained synchronization process.

Provider infrastructure internals, response security headers, actual invited-viewer login, mobile visual layout, and printed output remain unverified in this audit. These limits do not change the source-level finding that business APIs, shared persistence, and internal roles are absent.

## 12. Prioritized implementation roadmap

All work below requires implementation approval. No phase was started by this audit.

| Phase | Priority and dependency | Deliverables | Acceptance gate |
| --- | --- | --- | --- |
| 0. Preserve and define | P0, first | Preserve demo/source snapshot, approve release scope, collect spreadsheet samples, verify catalogs, roles, units/currency, costing, count cutoff, correction and closure rules | Signed-off requirements, data dictionary, permission matrix, and representative import/export examples |
| 1. Production foundation | P0, after phase 0 | New approved application structure, identity/session model, PostgreSQL schema/migrations, employee/location scope, safe config, staging and CI | Login/deactivation/session tests pass. Unauthorized reads/writes/exports fail. Migration/restore rehearsed in staging |
| 2. Inventory and catalog core | P0, after phase 1 | Materials/units, approved dated openings, recipe versions, stock documents/ledger, transactional balance updates, audit events, idempotency and reversals | Concurrent withdrawals cannot create invalid balances. Retry posts once. Recipe history and reversal totals remain correct |
| 3. Manual operations | P1, depends on stock core | Purchasing/independent receiving, dispatch/destination confirmation, sales entry, counts/adjustments, waste/staff use, reasons and approvals | Business walkthrough across assigned roles reconciles central stock, branches, sales consumption, count adjustments and approved variances |
| 4. Excel/CSV exchange | P1, parallel with UI after shared services stabilize | Versioned templates, uploads, staging/preview/errors, atomic document posting, import history, CSV/XLSX exports | Representative TANJE files reconcile. Quoted/Persian data survives. Reimport does not duplicate. Permission and formula-safety checks pass |
| 5. Dashboards and reports | P1, depends on trusted transactions | Selected/all-branch dashboards, date ranges, sales/payment reconciliation, discrepancy cases, waste/staff costs, reproducible report exports | Report totals match ledger/document queries. Closed-period reports reproduce or explicitly show revision |
| 6. Hardening and pilot | P0 release gate, after phases 1–5 | Security review, browser/accessibility/print QA, volume tests, monitoring, backup/restore drill, runbooks, training, controlled data migration | Pilot restaurant sign-off, zero unresolved critical/high integrity issues, restore drill within agreed objectives, permissions and exports accepted |
| 7. Independent production cutover | P0 release activity, after pilot approval | DNS/TLS, production configuration, approved migrations/openings, named support owner, rollback plan, phased branch rollout | Cutover reconciliation, employee access check, monitoring checks, backup evidence, and management approval |
| 8. POS adapter development | Later release, separate scope | Vendor-specific mapping and connector using established services, source IDs, retries, inbox/reconciliation, monitoring | Separate requirements, vendor approval, integration tests, and rollout decision |

### Minimum regression and acceptance coverage

- Receipt quantity and budget reconciliation with independently recorded inputs.
- Central-to-restaurant dispatch, partial receipt, return, and transfer variance.
- Sale consumption using the approved recipe version and exact quantity/currency rules.
- Waste and staff consumption that cannot double-post the same issue.
- Counts at a defined cutoff, retained recount history, authorized adjustment, and later backdated posting rules.
- Duplicate commands/files/rows, interrupted imports, retries, reversals, and concurrent stock withdrawals.
- Restaurant isolation, role restrictions, exported-file permissions, employee deactivation, and audit attribution.
- XLSX/CSV parsing with Persian/Arabic digits, Unicode text, BOM, quoting, dates, units, currencies, and malicious formula-like input.
- Saved and reproduced management reports against the same ledger data.
- Real browser refresh/restart, responsive layouts, keyboard/dialog focus, zoom, and print/export output.
- Database migration, restore to staging, release rollback, and application error monitoring.

### Implementation sequence and estimation boundary

Establish identity, durable schema, and transactional services before expanding the interface. Build manual entry first against those services, then reuse them for file import and future integration. Develop reports against posted operational data and include exports and recovery in the first-release acceptance criteria.

An implementation schedule or budget cannot be responsibly fixed from this repository alone. Team capacity, deployment/identity choices, spreadsheet complexity, production transaction volume, approval policies, and data migration scope need confirmation in phase 0.

### Approval boundary

Approve the target architecture, hosting approach, release-one requirements, permission matrix, and operational rules before implementation. The existing application remains a preserved demo. This audit authorizes no code rewrite, package installation, infrastructure change, live integration, payroll posting, or deployment.

---

### Evidence map

| Evidence reference | What it supports |
| --- | --- |
| dist/index.html lines 1–23 | Complete static document, RTL shell, selectors, dialog, no application login |
| dist/app.js lines 1–69 | Configuration, initial catalogs, generated opening stock and records |
| dist/app.js lines 71–118 | Stock arithmetic, localStorage loading, selected state, reconciliation calculations |
| dist/app.js lines 119–222 | Shared UI helpers, all eight views, chart/report computations, rendering |
| dist/app.js lines 224–260 | Form builders and all nine form definitions, native modal use |
| dist/app.js lines 268–352 | Numeric validation, sale snapshot, duplicates, stock checking, entry/import logic |
| dist/app.js lines 353–411 | Custom catalog loading, submit/persistence path, navigation, storage events |
| dist/style.css lines 1–15 | Local fonts, styling, responsive and print rules |
| dist/font-license.txt | Font attribution/license text |
| .openai/hosting.json | Static hosting declaration and retained demo identity |
| Git file list, commit log, and initial statuses | Seven tracked files, two implementation commits. Latest checkout clean, earlier report retained in historical checkout |
| Existing archive comparisons | Seven packaged file contents in each archive match the corresponding checkout |
| Isolated in-memory checks | Verified behavior and documented failure modes without browser writes |
| Read-only hosting metadata | Active version, custom audience and external-viewer count |
| Browser QA scope | No preview server/live browser test started in this read-only audit. Prior desktop preview is historical evidence |

All recommendations in this report are proposed engineering decisions. Source findings describe the inspected commit and explicitly identified runtime observations.
