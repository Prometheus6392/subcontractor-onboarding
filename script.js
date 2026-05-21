const form = document.querySelector("#onboardingForm");
const tableBody = document.querySelector("#userTable");
const emptyState = document.querySelector("#emptyState");
const recordCount = document.querySelector("#recordCount");
const formMessage = document.querySelector("#formMessage");
const searchInput = document.querySelector("#searchInput");

const users = [];

const fieldLabels = {
  name: "Name",
  client: "Client",
  billRate: "Bill Rate",
  phone: "Phone",
  email: "Email",
  entity: "Entity",
  agreement: "PA/PSA",
  wbs: "WBS",
  vendorName: "Vendor Name",
  dateOfJoining: "Date of Joining",
  contractEnd: "Contract End Date",
  contractExtension: "Contract Extension",
  rateRevision: "Rate Revision",
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
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
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

renderTable();
