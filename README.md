# ISF-Cambodia

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/) (Install via `npm install -g pnpm`)
- Git (for Husky hooks to work)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vivi-j/ISF-Cambodia
```

### 2. Install root dependencies

```bash
pnpm install
```

### 3. Set up Husky

```bash
pnpm prepare
```

### 4. Frontend setup

```
cd frontend
pnpm install
pnpm dev
```

### 5. Backend setup

In another terminal, do this:

```
cd..
cd backend
pnpm install
pnpm start
```
