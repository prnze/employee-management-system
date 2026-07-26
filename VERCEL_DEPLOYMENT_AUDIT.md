# Vercel Deployment Audit

Audit date: 2026-07-26

## Root Cause

`prnze.in` was not pointing to the Angular application's Vercel project.

Before the recovery, the domain was aliased to the legacy `prnze` deployment:

```text
prnze-eij89vsa9-princes-projects-e11fa0bf.vercel.app -> prnze.in
```

The linked Angular project is `princes-projects-e11fa0bf/employee-management-system`. Its latest production deployment was seven days old and its domain was not the active `prnze.in` alias. That older deployment returned the application root but did not serve the current SPA rewrite configuration for deep links, resulting in `404: NOT_FOUND` for `/ems`, `/sharex`, `/passx`, and `/formatx`.

This was a Vercel deployment/alias issue, not an Angular routing issue.

## Build Output

`npm run build` completed successfully on 2026-07-26.

Angular uses `@angular/build:application`. `angular.json` does not set an explicit `outputPath`, so Angular uses its default output location:

```text
dist/employee-management-system/
  browser/
    index.html
    main-ZKZNY4SQ.js
    styles-3NNOU5RC.css
    assets/
```

The configured Vercel output directory is correct:

```json
"outputDirectory": "dist/employee-management-system/browser"
```

The generated browser directory contains `index.html`, hashed JavaScript bundles, the stylesheet bundle, and static assets.

## Vercel Project Settings

The linked project is `princes-projects-e11fa0bf/employee-management-system`.

- Framework preset: Angular
- Root directory: `.`
- Build command: Vercel default (`npm run build` or `ng build`); `vercel.json` explicitly uses `npm run build`
- Install command: Vercel default package-manager install command
- Dashboard output directory: none; no dashboard setting overrides `vercel.json`
- Node version: 24.x
- Environment variables: none required for SPA routing

## Rewrite Configuration

The existing configuration was correct and required no code change:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrites every non-static request to Angular's `index.html`, allowing the client router to resolve `/ems`, `/sharex`, `/passx`, and `/formatx`.

## Deployment Log Findings

The previously active deployment was built on 2026-07-18 from commit `b061f28`. It built successfully, but it was not the current deployment and the custom domain targeted a different project.

The first 2026-07-26 upload attempt failed transiently with `fetch failed` during upload. A compressed retry using `--archive=tgz` succeeded.

Current production deployment:

```text
Deployment ID: dpl_FeCnUC3Tsum4DbhokKT9ZjTvFDW9
Status: Ready
URL: https://employee-management-system-l1kkh5xhu-princes-projects-e11fa0bf.vercel.app
```

## Deployment Fix

1. Deployed the current Angular application with the existing `vercel.json` configuration.
2. Reassigned `prnze.in` to the newly created Angular deployment.

Current alias:

```text
employee-management-system-l1kkh5xhu-princes-projects-e11fa0bf.vercel.app -> prnze.in
```

## Final Verification

The following HTTPS requests returned HTTP 200 after the alias change:

```text
https://prnze.in/          200
https://prnze.in/ems       200
https://prnze.in/sharex    200
https://prnze.in/passx     200
https://prnze.in/formatx   200
```

The direct production deployment returned HTTP 200 for the same paths.

## Remaining Notes

Angular's existing stylesheet-budget and CommonJS warnings did not prevent the build or deployment and are unrelated to the route incident.

DEPLOYMENT VERIFIED
