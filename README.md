# MadMap

> An interactive prerequisite map for UW–Madison courses.

A CS571 (Building User Interfaces, S26) class project. See [`PROPOSAL.md`](./PROPOSAL.md) for the original project proposal.

## Tech Stack

- **Vite** + **React 19** + **TypeScript** (with React Compiler)
- **Tailwind CSS v4** + **shadcn/ui**
- **React Router** for routing
- **Recharts** for grade distribution charts

## Getting Started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # type-check + production build
npm run lint     # eslint
npm run preview  # preview the production build
```

## Project Structure

```
src/
  pages/        routed pages (home, course, about)
  components/   layout, course views, shadcn ui primitives
  lib/          site config, navigation, course types
```

## Deployment

Deployed to GitHub Pages from the `main` branch.

## Disclaimer

Not affiliated with the University of Wisconsin–Madison.