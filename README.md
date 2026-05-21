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
- OU
- PA/PSA
- WBS
- WBS Code
- WBS/Project Code
- Project Code
- ICATS Verification
- Vendor Name
- Date of Joining
- Contract End Date
- Contract Extension
- Rate Revision

## Paste Email Parser Examples

The paste tool recognizes loose email wording such as:

- `bill 120`
- `rate is 125/hr`
- `First Name: Priya` and `Last Name: Sharma`
- `First Name Priya` and `Last Name Sharma`
- `First Legal Name of the Consultant Priya` and `Surname of the Consultant Sharma`
- `Client Name Contoso`
- `Candidate Rate 120`
- `Company Code ABC` or `Comapany Code ABC`
- `OU Code 123`, `OU 123`, or `Code OU 123`
- `PA PSA Details: PSA-2026`
- `PA PSA Details PSA-2026`
- `WBS Code WBS-900`
- `WBS/Project Code WBS-900`
