function pad2(n) {
  return String(n).padStart(2, "0");
}

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "HR Specialist",
  "DevOps Engineer",
  "QA Engineer",
  "Backend Engineer",
  "Frontend Developer",
  "Marketing Manager"
];

function buildMockEmployees(count = 48) {
  const employees = [];
  for (let i = 1; i <= count; i++) {
    const day = 1 + ((i - 1) % 28);
    const role = ROLES[(i - 1) % ROLES.length];
    employees.push({
      id: `emp_${i}`,
      name: `Employee ${i}`,
      role: role,
      arrivingOn: `2026-06-${pad2(day)}`,
      email: `employee${i}@company.com`,
      property: i % 2 === 0 ? "Schubert Residences" : "Garden Heights",
      unit: `${i % 2 === 0 ? 'A' : 'B'}-${100 + i}`,
      status: i % 3 === 0 ? "Pending" : i % 5 === 0 ? "Inactive" : "Active"
    });
  }
  return employees;
}

export const MOCK_EMPLOYEES = buildMockEmployees(48);
