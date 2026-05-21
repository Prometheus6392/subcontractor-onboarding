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
  client: "client",
  "bill rate": "billRate",
  billrate: "billRate",
  phone: "phone",
  "phone number": "phone",
  email: "email",
  entity: "entity",
  "pa/psa": "agreement",
  pa: "agreement",
  psa: "agreement",
  wbs: "wbs",
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
  client: "client",
  customer: "client",
  "bill rate": "billRate",
  "billing rate": "billRate",
  rate: "billRate",
  phone: "phone",
  mobile: "phone",
  "phone number": "phone",
  email: "email",
  "email address": "email",
  entity: "entity",
  "pa/psa": "agreement",
  agreement: "agreement",
  pa: "agreement",
  psa: "agreement",
  wbs: "wbs",
  "wbs code": "wbs",
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
    const key = emailLabelMap[normalizeHeader(parts[index]).replace(/:$/, "")];
    if (key && !parsed[key]) {
      parsed[key] = parts[index + 1];
    }
  }
}

function parseEmailText(text) {
  const parsed = {};
  const cleanedText = text.replace(/\r/g, "\n");
  const lines = cleanedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line) => {
    parseDelimitedEmailLine(line, parsed);

    const match = line.match(/^(.{2,45}?)[\s]*[:=-][\s]*(.+)$/);
    if (!match) return;

    const label = normalizeHeader(match[1]);
    const key = emailLabelMap[label];
    if (key && !parsed[key]) {
      parsed[key] = match[2].trim();
    }
  });

  const emailMatch = cleanedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = cleanedText.match(/(?:\+?\d[\d\s().-]{8,}\d)/);
  const billRateMatch = cleanedText.match(/(?:bill(?:ing)?\s*rate|rate)\D{0,12}(\d+(?:,\d{3})*(?:\.\d+)?)/i);
  const wbsMatch = cleanedText.match(/\bWBS[-\s:#]*([A-Z0-9-]{3,})\b/i);

  if (emailMatch && !parsed.email) parsed.email = emailMatch[0];
  if (phoneMatch && !parsed.phone) parsed.phone = phoneMatch[0].trim();
  if (billRateMatch && !parsed.billRate) parsed.billRate = billRateMatch[1];
  if (wbsMatch && !parsed.wbs) parsed.wbs = wbsMatch[1].toUpperCase();

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
