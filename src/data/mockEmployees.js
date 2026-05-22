const BASE_EMPLOYEES = [
  { id: "emp_anna", name: "Anna Müller", role: "Software Engineer", arrivingOn: "2026-06-01" },
  { id: "emp_james", name: "James Okafor", role: "Product Manager", arrivingOn: "2026-06-05" },
  { id: "emp_priya", name: "Priya Sharma", role: "Data Analyst", arrivingOn: "2026-06-10" },
  { id: "emp_lucas", name: "Lucas Weber", role: "UX Designer", arrivingOn: "2026-06-12" },
  { id: "emp_sara", name: "Sara Ibrahim", role: "HR Specialist", arrivingOn: "2026-06-15" },
  { id: "emp_mateo", name: "Mateo García", role: "DevOps Engineer", arrivingOn: "2026-06-18" },
  { id: "emp_zoe", name: "Zoë Dubois", role: "QA Engineer", arrivingOn: "2026-06-20" },
  { id: "emp_chen", name: "Michael Chen", role: "Backend Engineer", arrivingOn: "2026-06-22" },
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function buildMockEmployees(count = 48) {
  const employees = [...BASE_EMPLOYEES];
  let idx = employees.length + 1;
  while (employees.length < count) {
    const day = 1 + ((idx - 1) % 28);
    employees.push({
      id: `emp_${idx}`,
      name: `Employee ${idx}`,
      role: "Relocating Employee",
      arrivingOn: `2026-06-${pad2(day)}`,
    });
    idx += 1;
  }
  return employees.slice(0, count);
}

export const MOCK_EMPLOYEES = buildMockEmployees(48);

