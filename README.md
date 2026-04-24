# 📄 Invoice App

A fully responsive invoice management application built with React, based on the Figma design. Users can create, read, update, and delete invoices, save drafts, mark invoices as paid, filter by status, and toggle between light and dark mode.

---

## 🔗 Live Demo

> https://eniola-henry.github.io/HNG-stage2/
---

## 📸 Screenshots

| Dark Mode | Light Mode |
|---|---|
| <img width="1366" height="615" alt="image" src="https://github.com/user-attachments/assets/7b3ba571-91ef-462f-811a-b07190f2b2ee" /> | <img width="1366" height="605" alt="image" src="https://github.com/user-attachments/assets/86138294-254a-4b69-bfae-a45bd82a5189" /> |

---

## ✅ Features Implemented

### Core CRUD
- ✅ **Create** invoices with full form validation
- ✅ **Read** — view invoice list and full invoice detail
- ✅ **Update** — edit any existing invoice
- ✅ **Delete** — with confirmation modal before deletion

### Invoice Status Flow
- ✅ Save invoice as **Draft** (skips validation on draft save)
- ✅ Save invoice as **Pending** (full validation required)
- ✅ Mark **Pending** invoices as **Paid**
- ✅ Status clearly shown in list view and detail view via colour-coded badge

### Filtering
- ✅ Filter invoices by **Draft**, **Pending**, **Paid** (multi-select checkboxes)
- ✅ Filter state updates list immediately
- ✅ Empty state message when no invoices match the selected filter

### UI / UX
- ✅ **Light / Dark mode** toggle — preference saved to `localStorage`
- ✅ **Fully responsive** — mobile (320px+), tablet (768px+), desktop (1024px+)
- ✅ **Hover states** on all interactive elements
- ✅ **Animations** — drawer slide-in, card stagger, modal pop, page fade
- ✅ Custom **Date Field** with formatted display (`21 Aug 2021`)
- ✅ Custom **Payment Terms** dropdown matching Figma design
- ✅ Custom **Empty State** illustration
- ✅ Real **profile photo** avatar in navbar

### Data Persistence
- ✅ All invoice data persisted to **localStorage**
- ✅ Theme preference persisted to **localStorage**
- ✅ 7 sample invoices loaded on first visit

### Accessibility
- ✅ Semantic HTML (`<main>`, `<nav>`, `<aside>`, `<fieldset>`, `<address>`)
- ✅ All form fields have associated `<label>` elements
- ✅ All buttons are `<button>` elements
- ✅ Delete modal traps focus, closes on `Escape`, and is keyboard navigable
- ✅ `role="dialog"` and `aria-modal="true"` on modals
- ✅ `aria-live` regions for dynamic content (invoice count, empty state)
- ✅ WCAG AA colour contrast in both light and dark modes
- ✅ `role="status"` on status badges

---

## 🗂️ Project Structure

```
invoice-app/
├── index.html                          # HTML entry point
├── vite.config.js                      # Vite configuration
├── package.json                        # Dependencies and scripts
│
└── src/
    ├── main.jsx                        # App entry — mounts React + providers
    ├── App.jsx                         # Root component — page routing logic
    │
    ├── assets/
    │   ├── profile.png                 # User avatar image
    │   └── empty-state.png             # Empty state illustration
    │
    ├── styles/
    │   ├── variables.css               # All CSS custom properties (design tokens)
    │   └── globals.css                 # Reset, layout, global button styles, animations
    │
    ├── data/
    │   └── sampleInvoices.js           # 7 default invoices loaded on first visit
    │
    ├── utils/
    │   ├── formatters.js               # formatDate(), formatCurrency()
    │   └── invoiceHelpers.js           # generateInvoiceId(), addDaysToDate(), calcInvoiceTotal()
    │
    ├── context/
    │   ├── ThemeContext.jsx             # isDark state + toggleTheme, persists to localStorage
    │   └── InvoiceContext.jsx          # invoices state + createInvoice, updateInvoice,
    │                                   # deleteInvoice, markInvoiceAsPaid
    │
    └── components/
        ├── Navbar/
        │   ├── Navbar.jsx              # Sidebar (desktop) / top bar (mobile)
        │   └── Navbar.css              # Responsive layout for nav
        │
        ├── StatusBadge/
        │   ├── StatusBadge.jsx         # Coloured badge: paid / pending / draft
        │   └── StatusBadge.css
        │
        ├── FilterDropdown/
        │   ├── FilterDropdown.jsx      # Multi-select checkbox dropdown
        │   └── FilterDropdown.css
        │
        ├── InvoiceCard/
        │   ├── InvoiceCard.jsx         # Single row in the invoice list
        │   └── InvoiceCard.css         # Stagger animation on entry
        │
        ├── InvoiceList/
        │   ├── InvoiceList.jsx         # List page: header + filter + cards
        │   └── InvoiceList.css
        │
        ├── InvoiceDetail/
        │   ├── InvoiceDetail.jsx       # Full invoice view with action buttons
        │   └── InvoiceDetail.css       # Mobile bottom action bar
        │
        ├── InvoiceForm/
        │   ├── InvoiceForm.jsx         # Slide-in drawer: create + edit form
        │   └── InvoiceForm.css         # Includes custom date field + terms dropdown styles
        │
        ├── DeleteModal/
        │   ├── DeleteModal.jsx         # Confirmation modal with focus trap
        │   └── DeleteModal.css
        │
        └── EmptyState/
            ├── EmptyState.jsx          # Illustration + message when no invoices
            └── EmptyState.css
```

---

## 🏗️ Architecture

### State Management
The app uses **React Context API** with two separate providers:

**`ThemeContext`**
- Holds one boolean: `isDark`
- Reads initial value from `localStorage` (falls back to `prefers-color-scheme`)
- On change: writes `data-theme` attribute to `<html>` and saves to `localStorage`
- Consumed by `Navbar` (to render the correct icon)

**`InvoiceContext`**
- Holds the full `invoices` array
- Exposes four actions: `createInvoice`, `updateInvoice`, `deleteInvoice`, `markInvoiceAsPaid`
- Persists entire array to `localStorage` on every change using `useEffect`
- On first load: tries to read from `localStorage`, falls back to `SAMPLE_INVOICES`

### Page Routing
There is no React Router. Page navigation is handled by simple state in `App.jsx`:
```
currentPage: "list" | "detail"
selectedId: string | null
```
This is intentional — the app has only two views, so a full router would be unnecessary complexity.

### Data Flow
```
InvoiceContext (source of truth)
    ↓
InvoiceList → shows filtered list
    ↓
InvoiceCard → single row, click fires onSelectInvoice(id)
    ↓
App.jsx → sets selectedId + currentPage = "detail"
    ↓
InvoiceDetail → reads invoice by id from context
    ↓
InvoiceForm (drawer) → reads/writes via createInvoice / updateInvoice
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** v18 or higher — download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node)

### Steps

**1. Clone or download the project**
```bash
# If you have git:
git clone https://github.com/YOUR_USERNAME/invoice-app.git
cd invoice-app

# Or extract the downloaded ZIP and open the folder
```

**2. Install dependencies**
```bash
npm install
```
This downloads React, Vite, and all other packages into `node_modules/`.

**3. Start the development server**
```bash
npm run dev
```

**4. Open in browser**
```
http://localhost:5173
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build for production (output in `/dist`) |
| `npm run preview` | Preview the production build locally |

---

## 🚀 Deployment (Vercel — Recommended)

### Option A — Deploy via Vercel website (easiest)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up / log in
3. Click **"Add New Project"**
4. Select your GitHub repository
5. Vercel auto-detects Vite — leave all settings as default
6. Click **"Deploy"**
7. Your live URL will be ready in ~60 seconds ✅

### Option B — Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Inside your project folder:
vercel

# Follow the prompts. For framework, select "Vite"
```

### Option C — Deploy to Netlify

1. Run `npm run build` — this creates a `/dist` folder
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `/dist` folder onto the Netlify dashboard
4. Done — live URL generated instantly ✅

---

## ♿ Accessibility Notes

| Area | Implementation |
|---|---|
| Semantic HTML | `<main>`, `<nav>`, `<aside>`, `<header>`, `<fieldset>`, `<legend>`, `<address>` used throughout |
| Form labels | Every `<input>` and `<select>` has an associated `<label>` via `htmlFor` |
| Buttons | All interactive elements are `<button>` — no `<div onClick>` |
| Modal focus trap | `DeleteModal` focuses the Cancel button on mount; `Escape` key closes it |
| ARIA | `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-live`, `aria-expanded`, `aria-haspopup` |
| Colour contrast | All text meets WCAG AA (4.5:1 minimum) in both light and dark mode |
| Status badges | Use `role="status"` and `aria-label` so screen readers announce the status |
| Keyboard nav | All dropdowns (filter, payment terms) close on `Escape`; outside clicks also close them |

---

## 🔄 Trade-offs & Decisions

### No React Router
**Decision:** Used simple `useState` for page navigation.  
**Reason:** The app only has two views (list and detail). Adding React Router would introduce extra setup, URL params, and bundle size without meaningful benefit at this scale.  
**Trade-off:** Deep linking to a specific invoice is not possible. If the app grows to have more pages, React Router should be added.

### CSS Modules vs Plain CSS
**Decision:** Used plain CSS files imported per-component.  
**Reason:** Keeps things simple and readable for a project of this size. The naming convention (`component__element--modifier`) avoids class name clashes without needing CSS Modules.  
**Trade-off:** Global class name collisions are possible if naming is not careful.

### Context API vs Redux / Zustand
**Decision:** Used React Context + `useState`.  
**Reason:** The app has a single data source (invoices array) with straightforward CRUD. Context is built into React and avoids adding external dependencies.  
**Trade-off:** Context re-renders all consumers on every change. For a large list (1000+ invoices) this could be slow, but is perfectly fine for this project.

### LocalStorage vs Backend
**Decision:** Used `localStorage` for persistence.  
**Reason:** No server setup needed, works offline, zero cost to run.  
**Trade-off:** Data is per-device and per-browser. Cannot sync across devices or users. A real app would use a backend (Node/Express or Next.js API routes) with a database.

### Custom Dropdown vs Native Select
**Decision:** Built a custom `PaymentTermsDropdown` component.  
**Reason:** Native `<select>` cannot be styled to match the Figma design across all browsers/OS. The custom component gives full visual control.  
**Trade-off:** More code to maintain. Must manually handle open/close, keyboard events, and ARIA.

---

## 🔮 Improvements Beyond Requirements

1. **Stagger animations** — Invoice cards animate in one-by-one using CSS `animation-delay`
---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM rendering |
| `vite` | ^6.0.5 | Build tool and dev server |
| `@vitejs/plugin-react` | ^4.3.4 | Vite plugin for JSX/React |

> No external UI libraries, no icon packages, no CSS frameworks — everything is hand-built.

---

## 👤 Author

by Eniola Henry

---

## 📝 License

This project is for educational/assessment purposes only.
