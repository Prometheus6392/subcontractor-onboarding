const form = document.querySelector("#onboardingForm");
const tableBody = document.querySelector("#userTable");
const emptyState = document.querySelector("#emptyState");
const recordCount = document.querySelector("#recordCount");
const formMessage = document.querySelector("#formMessage");
const emailPaste = document.querySelector("#emailPaste");
const fillFromEmail = document.querySelector("#fillFromEmail");
const clearEmailPaste = document.querySelector("#clearEmailPaste");
const searchInput = document.querySelector("#searchInput");
const exportExcel = document.querySelector("#exportExcel");
const excelUpload = document.querySelector("#excelUpload");
const totalUsers = document.querySelector("#totalUsers");
const icatsVerified = document.querySelector("#icatsVerified");
const endingSoon = document.querySelector("#endingSoon");
const averageRate = document.querySelector("#averageRate");
const icatsProgress = document.querySelector("#icatsProgress");
const icatsProgressText = document.querySelector("#icatsProgressText");
const extensionProgress = document.querySelector("#extensionProgress");
const extensionProgressText = document.querySelector("#extensionProgressText");
const rateProgress = document.querySelector("#rateProgress");
const rateProgressText = document.querySelector("#rateProgressText");

const users = [];
const completeWords = ["verified", "complete", "completed", "approved", "done", "yes"];

const fieldLabels = {
  name: "Name",
  client: "Client",
  billRate: "Bill Rate",
  phone: "Phone",
  email: "Email",
  entity: "Entity",
  ou: "OU",
  agreement: "PA/PSA",
  wbs: "WBS",
  icatsVerification: "ICATS Verification",
  vendorName: "Vendor Name",
  dateOfJoining: "Date of Joining",
  contractEnd: "Contract End Date",
  contractExtension: "Contract Extension",
  rateRevision: "Rate Revision",
};

const uploadHeaderMap = {
  name: "name",
  "add name": "name",
  "first name": "firstName",
  "first legal name": "firstName",
  "first legal name of the consultant:": "firstName",
  "legal first name:": "firstName",
  "last name:": "lastName",
  surname: "lastName",
  "surname of the consultant": "lastName",
  client: "client",
  "client name": "client",
  "bill rate": "billRate",
  "candidate rate": "billRate",
  billrate: "billRate",
  phone: "phone",
  "phone number": "phone",
  email: "email",
  "email address": "email",
  entity: "entity",
  "company code": "entity",
  "comapany code": "entity",
  company: "entity",
  ou: "ou",
  "ou code": "ou",
  "code ou": "ou",
  "ou number": "ou",
  "pa/psa": "agreement",
  pa: "agreement",
  psa: "agreement",
  wbs: "wbs",
  "wbs/project code": "wbs",
  "wbs project code": "wbs",
  "icats verification": "icatsVerification",
  icats: "icatsVerification",
  "vendor name": "vendorName",
  vendor: "vendorName",
  "date of joining": "dateOfJoining",
  doj: "dateOfJoining",
  "contract end date": "contractEnd",
  "end date": "contractEnd",
  "contract extension": "contractExtension",
  "rate revision": "rateRevision",
  "rate rivision": "rateRevision",
};

const emailLabelMap = {
  name: "name",
  "add name": "name",
  "candidate name": "name",
  "consultant name": "name",
  subcontractor: "name",
  "first name": "firstName",
  "first legal name": "firstName",
  "first legal name of the consultant": "firstName",
  "legal first name": "firstName",
  "legal first name of the consultant": "firstName",
  firstname: "firstName",
  "last name": "lastName",
  lastname: "lastName",
  surname: "lastName",
  "surname of the consultant": "lastName",
  client: "client",
  "client name": "client",
  customer: "client",
  "bill rate": "billRate",
  "billing rate": "billRate",
  "billrate": "billRate",
  "candidate rate": "billRate",
  "hourly rate": "billRate",
  "rate per hour": "billRate",
  "rate/hr": "billRate",
  "rate / hr": "billRate",
  "rate per hr": "billRate",
  rate: "billRate",
  phone: "phone",
  mobile: "phone",
  "phone number": "phone",
  email: "email",
  "email address": "email",
  entity: "entity",
  "company code": "entity",
  "comapany code": "entity",
  company: "entity",
  ou: "ou",
  "ou code": "ou",
  "code ou": "ou",
  "ou number": "ou",
  "pa/psa": "agreement",
  "pa psa": "agreement",
  "pa-psa": "agreement",
  "pa & psa": "agreement",
  "pa and psa": "agreement",
  "pa or psa": "agreement",
  "pa/psa details": "agreement",
  "pa psa details": "agreement",
  "pa/psa number": "agreement",
  "pa number": "agreement",
  "psa number": "agreement",
  "pa id": "agreement",
  "psa id": "agreement",
  agreement: "agreement",
  pa: "agreement",
  psa: "agreement",
  wbs: "wbs",
  "wbs code": "wbs",
  "wbs/project code": "wbs",
  "wbs project code": "wbs",
  "project code": "wbs",
  "wbs number": "wbs",
  "wbs no": "wbs",
  "wbs id": "wbs",
  "wbs#": "wbs",
  "icats verification": "icatsVerification",
  icats: "icatsVerification",
  "vendor name": "vendorName",
  vendor: "vendorName",
  "date of joining": "dateOfJoining",
  joining: "dateOfJoining",
  doj: "dateOfJoining",
  "start date": "dateOfJoining",
  "contract end date": "contractEnd",
  "end date": "contractEnd",
  "contract extension": "contractExtension",
  extension: "contractExtension",
  "rate revision": "rateRevision",
  "rate rivision": "rateRevision",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US");
  }
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeDateValue(value) {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const text = String(value).trim();
  if (!text) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return text;
}

function normalizeBillRate(value) {
  const match = String(value || "").match(/\d+(?:,\d{3})*(?:\.\d+)?/);
  return match ? match[0].replaceAll(",", "") : "";
}

function normalizeEmailLabel(value) {
  return normalizeHeader(value)
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*#\s*/g, "#");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFormData() {
  return Object.fromEntries(new FormData(form).entries());
}

function normalizeUserRecord(record) {
  const normalized = {};

  Object.entries(record).forEach(([header, value]) => {
    const key = uploadHeaderMap[normalizeHeader(header)];
    if (key) {
      normalized[key] = value ?? "";
    }
  });

  if (!normalized.name) {
    normalized.name = [normalized.firstName, normalized.lastName].filter(Boolean).join(" ").trim();
  }

  Object.keys(fieldLabels).forEach((key) => {
    normalized[key] = String(normalized[key] ?? "").trim();
  });

  normalized.dateOfJoining = normalizeDateValue(normalized.dateOfJoining);
  normalized.contractEnd = normalizeDateValue(normalized.contractEnd);

  return normalized;
}

function fillFormFields(data) {
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field && String(value || "").trim()) {
      field.value = value;
      field.classList.remove("invalid");
    }
  });
}

function parseDelimitedEmailLine(line, parsed) {
  const parts = line.split(/\t|\s{2,}/).map((part) => part.trim()).filter(Boolean);

  if (parts.length < 2) return;

  for (let index = 0; index < parts.length - 1; index += 2) {
    const key = emailLabelMap[normalizeEmailLabel(parts[index]).replace(/:$/, "")];
    if (key && !parsed[key]) {
      parsed[key] = parts[index + 1];
    }
  }
}

function parseLooseEmailLine(line, parsed) {
  const loosePatterns = [
    ["firstName", /\b(?:first\s*name|first legal name of the consultant)?|legal first name of the consultant)?)\s+(.+)$/i],
    ["lastName", /\b(?:last name|surname of the consultant)?)\s+(.+)$/i],
    ["name", /\b(?:name|candidate\s*name|consultant\s*name)\s+(.+)$/i],
    ["client", /\b(?:client|client\s*name|customer)\s+(.+)$/i],
    ["entity", /\b(?:entity|company\s*code|comapany\s*code|company)\s+(.+)$/i],
    ["ou", /\b(?:ou\s*code|code\s*ou|ou|ou\s*number)\s+(.+)$/i],
    ["agreement", /\b(?:pa\s*\/?\s*psa|pa\s+psa|pa|psa)\s+(?:number|no|id|details|code)?\s*(.+)$/i],
    ["wbs", /\b(?:wbs\s*\/?\s*project\s*code|wbs\s*project\s*code|wbs|project\s*code)\s*(?:code|number|no|id|#)?\s+([A-Z0-9][A-Z0-9-]{2,})\b/i],
    ["icatsVerification", /\bicats(?:\s*verification)?\s+(.+)$/i],
    ["vendorName", /\bvendor(?:\s*name)?\s+(.+)$/i],
    ["dateOfJoining", /\b(?:date\s*of\s*joining|joining|doj|start\s*date)\s+(.+)$/i],
    ["contractEnd", /\b(?:contract\s*end\s*date|end\s*date)\s+(.+)$/i],
    ["contractExtension", /\b(?:contract\s*extension|extension)\s+(.+)$/i],
    ["rateRevision", /\b(?:rate\s*revision|rate\s*rivision)\s+(.+)$/i],
  ];

  loosePatterns.forEach(([key, pattern]) => {
    const match = line.match(pattern);
    if (match && !parsed[key]) {
      parsed[key] = match[1].trim();
    }
  });
}

function findBillRateFromText(lines) {
  const ratePattern =
    /(?:candidate\s*rate|bill\s*rate|billing\s*rate|billrate|hourly\s*rate|bill|rate\s*(?:is|:|-|=|per\s*(?:hour|hr)|\/\s*hr)?)\D{0,16}(\d+(?:,\d{3})*(?:\.\d+)?)/i;
  const rateLine = lines.find((line) => {
    const normalized = normalizeHeader(line);
    return (
      !normalized.includes("rate revision") &&
      !normalized.includes("rate rivision") &&
      !normalized.includes("medical bill") &&
      ratePattern.test(line)
    );
  });

  return rateLine ? rateLine.match(ratePattern)[1] : "";
}

function parseEmailText(text) {
  const parsed = {};
  const cleanedText = text.replace(/\r/g, "\n").replace(/;/g, "\n");
  const lines = cleanedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line) => {
    parseDelimitedEmailLine(line, parsed);
    parseLooseEmailLine(line, parsed);

    const match = line.match(/^(.{2,45}?)[\s]*[:=-][\s]*(.+)$/);
    if (!match) return;

    const label = normalizeEmailLabel(match[1]);
    const key = emailLabelMap[label];
    if (key && !parsed[key]) {
      parsed[key] = match[2].trim();
    }
  });

  if (!parsed.name) {
    parsed.name = [parsed.firstName, parsed.lastName].filter(Boolean).join(" ").trim();
  }

  const emailMatch = cleanedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = cleanedText.match(/(?:\+?\d[\d\s().-]{8,}\d)/);
  const wbsMatch = cleanedText.match(
    /\b(?:WBS\s*\/?\s*Project\s*Code|WBS\s*Project\s*Code|WBS|Project\s*Code)\s*(?:code|number|no|id|#)?\s*[:#=-]?\s*([A-Z0-9][A-Z0-9-]{2,})\b/i
  );
  const agreementMatch = cleanedText.match(
    /\b(?:PA\s*\/?\s*PSA|PA\s+PSA|PA|PSA)\s*(?:number|no|id|details|code)?\s*[:#=-]?\s*([A-Z0-9][A-Z0-9/_-]{1,})\b/i
  );

  if (emailMatch && !parsed.email) parsed.email = emailMatch[0];
  if (phoneMatch && !parsed.phone) parsed.phone = phoneMatch[0].trim();
  if (!parsed.billRate) parsed.billRate = findBillRateFromText(lines);
  if (wbsMatch && !parsed.wbs) parsed.wbs = wbsMatch[1].toUpperCase();
  if (agreementMatch && !parsed.agreement) parsed.agreement = agreementMatch[1].toUpperCase();

  parsed.billRate = normalizeBillRate(parsed.billRate);
  parsed.dateOfJoining = normalizeDateValue(parsed.dateOfJoining);
  parsed.contractEnd = normalizeDateValue(parsed.contractEnd);

  return parsed;
}

function validate(data) {
  const missing = Object.entries(fieldLabels)
    .filter(([key]) => !String(data[key] || "").trim())
    .map(([, label]) => label);

  form.querySelectorAll("input, select").forEach((field) => {
    field.classList.toggle("invalid", !String(data[field.name] || "").trim());
  });

  if (missing.length) {
    return `Please complete: ${missing.join(", ")}.`;
  }

  if (!form.email.validity.valid) {
    form.email.classList.add("invalid");
    return "Please enter a valid email address.";
  }

  if (Number(data.billRate) < 0) {
    form.billRate.classList.add("invalid");
    return "Bill Rate cannot be negative.";
  }

  return "";
}

function matchesSearch(user, query) {
  if (!query) return true;
  return Object.values(user).join(" ").toLowerCase().includes(query.toLowerCase());
}

function isCompleteStatus(value) {
  const normalized = String(value || "").toLowerCase();
  return completeWords.some((word) => normalized.includes(word));
}

function getPercent(count, total) {
  return total ? Math.round((count / total) * 100) : 0;
}

function setProgress(progressElement, textElement, count, total) {
  const percent = getPercent(count, total);
  progressElement.value = percent;
  textElement.textContent = `${percent}%`;
}

function getEndingSoonCount() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const soon = new Date(today);
  soon.setDate(today.getDate() + 30);

  return users.filter((user) => {
    const endDate = new Date(`${user.contractEnd}T00:00:00`);
    return endDate >= today && endDate <= soon;
  }).length;
}

function renderDashboard() {
  const total = users.length;
  const icatsDone = users.filter((user) => isCompleteStatus(user.icatsVerification)).length;
  const extensionDone = users.filter((user) => isCompleteStatus(user.contractExtension)).length;
  const rateDone = users.filter((user) => isCompleteStatus(user.rateRevision)).length;
  const rateTotal = users.reduce((sum, user) => sum + Number(user.billRate || 0), 0);

  totalUsers.textContent = total;
  icatsVerified.textContent = icatsDone;
  endingSoon.textContent = getEndingSoonCount();
  averageRate.textContent = formatCurrency(total ? rateTotal / total : 0);

  setProgress(icatsProgress, icatsProgressText, icatsDone, total);
  setProgress(extensionProgress, extensionProgressText, extensionDone, total);
  setProgress(rateProgress, rateProgressText, rateDone, total);
}

function renderTable() {
  const query = searchInput.value.trim();
  const visibleUsers = users.filter((user) => matchesSearch(user, query));

  tableBody.innerHTML = visibleUsers
    .map(
      (user) => `
        <tr>
          <td><strong>${escapeHtml(user.name)}</strong></td>
          <td>${escapeHtml(user.client)}</td>
          <td>${formatCurrency(user.billRate)}</td>
          <td class="contact-cell">
            <a href="tel:${escapeHtml(user.phone)}">${escapeHtml(user.phone)}</a>
            <a href="mailto:${escapeHtml(user.email)}">${escapeHtml(user.email)}</a>
          </td>
          <td>${escapeHtml(user.entity)}</td>
          <td>${escapeHtml(user.ou)}</td>
          <td>${escapeHtml(user.agreement)}</td>
          <td>${escapeHtml(user.wbs)}</td>
          <td>${escapeHtml(user.icatsVerification)}</td>
          <td>${escapeHtml(user.vendorName)}</td>
          <td>${formatDate(user.dateOfJoining)}</td>
          <td>${formatDate(user.contractEnd)}</td>
          <td>${escapeHtml(user.contractExtension)}</td>
          <td>${escapeHtml(user.rateRevision)}</td>
        </tr>
      `
    )
    .join("");

  emptyState.style.display = visibleUsers.length ? "none" : "grid";
  recordCount.textContent = `${users.length} ${users.length === 1 ? "record" : "records"}`;
  exportExcel.disabled = users.length === 0;
  renderDashboard();
}

function getExportRows() {
  return users.map((user) => ({
    Name: user.name,
    Client: user.client,
    "Bill Rate": formatCurrency(user.billRate),
    Phone: user.phone,
    Email: user.email,
    Entity: user.entity,
    OU: user.ou,
    "PA/PSA": user.agreement,
    WBS: user.wbs,
    "ICATS Verification": user.icatsVerification,
    "Vendor Name": user.vendorName,
    "Date of Joining": formatDate(user.dateOfJoining),
    "Contract End Date": formatDate(user.contractEnd),
    "Contract Extension": user.contractExtension,
    "Rate Revision": user.rateRevision,
  }));
}

function downloadExcel() {
  if (!users.length) {
    formMessage.textContent = "Add at least one user before exporting.";
    return;
  }

  const rows = getExportRows();

  if (window.XLSX) {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Onboarding");
    const output = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([output], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "subcontractor-onboarding-list.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    return;
  }

  const headers = Object.keys(rows[0]);
  const tableRows = rows
    .map(
      (row) => `
        <tr>${headers.map((header) => `<td>${escapeHtml(row[header])}</td>`).join("")}</tr>
      `
    )
    .join("");
  const workbook = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "subcontractor-onboarding-list.xls";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function importRows(rows) {
  const validRows = [];
  const skippedRows = [];

  rows.forEach((row, index) => {
    const user = normalizeUserRecord(row);
    const missing = Object.keys(fieldLabels).filter((key) => !String(user[key] || "").trim());

    if (missing.length) {
      skippedRows.push(index + 2);
      return;
    }

    validRows.push(user);
  });

  if (!validRows.length) {
    formMessage.textContent = "No complete rows found. Check that your Excel headers match the onboarding fields.";
    return;
  }

  users.unshift(...validRows);
  formMessage.textContent = `Imported ${validRows.length} ${validRows.length === 1 ? "user" : "users"}${
    skippedRows.length ? `; skipped rows ${skippedRows.join(", ")} because required fields were missing.` : "."
  }`;
  renderTable();
}

function uploadExcelFile(file) {
  if (!file) return;

  if (!window.XLSX) {
    formMessage.textContent = "Excel upload library did not load. Check your internet connection and try again.";
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", (event) => {
    const workbook = XLSX.read(event.target.result, {
      type: "array",
      cellDates: true,
    });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, {
      defval: "",
      raw: false,
    });

    importRows(rows);
  });

  reader.addEventListener("error", () => {
    formMessage.textContent = "Could not read the selected Excel file.";
  });

  reader.readAsArrayBuffer(file);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getFormData();
  const error = validate(data);

  if (error) {
    formMessage.textContent = error;
    return;
  }

  users.unshift(data);
  form.reset();
  formMessage.textContent = "User added to onboarding list.";
  form.querySelectorAll(".invalid").forEach((field) => field.classList.remove("invalid"));
  renderTable();
});

form.addEventListener("reset", () => {
  formMessage.textContent = "";
  form.querySelectorAll(".invalid").forEach((field) => field.classList.remove("invalid"));
});

searchInput.addEventListener("input", renderTable);
exportExcel.addEventListener("click", downloadExcel);
excelUpload.addEventListener("change", (event) => {
  uploadExcelFile(event.target.files[0]);
  event.target.value = "";
});
fillFromEmail.addEventListener("click", () => {
  const parsed = parseEmailText(emailPaste.value);
  const matchedFields = Object.keys(parsed).filter((key) => String(parsed[key] || "").trim());

  if (!matchedFields.length) {
    formMessage.textContent = "Paste email details with labels like Name, Client, Bill Rate, Email, WBS, or Vendor Name.";
    return;
  }

  fillFormFields(parsed);
  formMessage.textContent = `Filled ${matchedFields.length} ${matchedFields.length === 1 ? "field" : "fields"} from pasted email data.`;
});
clearEmailPaste.addEventListener("click", () => {
  emailPaste.value = "";
  formMessage.textContent = "";
});

renderTable();
