const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const findBillRateFromText = (lines) => {
  const ratePattern =
    /(?:bill\s*rate|billing\s*rate|billrate|hourly\s*rate|bill|rate\s*(?:is|:|-|=|per\s*(?:hour|hr)|\/\s*hr)?)\D{0,16}(\d+(?:,\d{3})*(?:\.\d+)?)/i;
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
};

const samples = [
  ["bill 120", "120"],
  ["Bill Rate: $95", "95"],
  ["rate is 125/hr", "125"],
  ["Rate Revision: Pending", ""],
];

samples.forEach(([input, expected]) => {
  const actual = findBillRateFromText([input]);
  if (actual !== expected) {
    throw new Error(`${input} expected ${expected} but received ${actual}`);
  }
});

console.log("Parser smoke test passed");
