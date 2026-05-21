# Subcontractor Onboarding

A static GitHub Pages website for subcontractor onboarding.

## Features

- Add subcontractor onboarding records manually
- Paste email text and auto-fill the form fields
- Upload onboarding records from Excel or CSV
- Export the onboarding list to Excel
- View dashboard progress for ICATS verification, contract extension, and rate revision
- Search the current onboarding list

## GitHub Pages Setup

1. Create a GitHub repository.
2. Upload these files to the repository root:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `xlsx.full.min.js`
   - `.nojekyll`
   - `README.md`
3. Open the repository on GitHub.
4. Go to **Settings > Pages**.
5. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save.

Your website will be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

## Excel Import Headers

The upload tool recognizes these column headers:

- Name
- First Name
- Last Name
- Client
- Bill Rate
- Phone
- Email
- Entity
- PA/PSA
- WBS
- WBS Code
- ICATS Verification
- Vendor Name
- Date of Joining
- Contract End Date
- Contract Extension
- Rate Revision

