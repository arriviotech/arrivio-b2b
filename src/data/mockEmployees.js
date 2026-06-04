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
  
  // Assignment schema to match contract properties and their unit layouts
  const assignments = [
    // --- Berlin Central Hub (10 units: S-101 to S-110) ---
    // S-101 Shared Room (Bed 1, Bed 2 occupied, Bed 3 vacant)
    { property: "Berlin Central Hub", unit: "S-101 (Bed 1)", status: "Active" },
    { property: "Berlin Central Hub", unit: "S-101 (Bed 2)", status: "Active" },
    // S-102 Shared Room (Bed 1, Bed 2 occupied, Bed 3 vacant)
    { property: "Berlin Central Hub", unit: "S-102 (Bed 1)", status: "Active" },
    { property: "Berlin Central Hub", unit: "S-102 (Bed 2)", status: "Active" },
    // S-103 Shared Room (Bed 1, Bed 2 occupied, Bed 3 vacant)
    { property: "Berlin Central Hub", unit: "S-103 (Bed 1)", status: "Active" },
    { property: "Berlin Central Hub", unit: "S-103 (Bed 2)", status: "Active" },
    // S-104, S-105, S-106, S-107 Studio Apartments
    { property: "Berlin Central Hub", unit: "S-104", status: "Active" },
    { property: "Berlin Central Hub", unit: "S-105", status: "Active" },
    { property: "Berlin Central Hub", unit: "S-106", status: "Active" },
    // S-108, S-109, S-110 Individual Units
    { property: "Berlin Central Hub", unit: "S-108", status: "Active" },

    // --- Frankfurt Sachsenhausen (12 units: S-101 to S-112) ---
    // S-101 Shared Room
    { property: "Frankfurt Sachsenhausen", unit: "S-101 (Bed 1)", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-101 (Bed 2)", status: "Active" },
    // S-102 Shared Room
    { property: "Frankfurt Sachsenhausen", unit: "S-102 (Bed 1)", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-102 (Bed 2)", status: "Active" },
    // S-103 Shared Room
    { property: "Frankfurt Sachsenhausen", unit: "S-103 (Bed 1)", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-103 (Bed 2)", status: "Active" },
    // S-104 Shared Room
    { property: "Frankfurt Sachsenhausen", unit: "S-104 (Bed 1)", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-104 (Bed 2)", status: "Active" },
    // S-105 to S-109 Studio Apartments
    { property: "Frankfurt Sachsenhausen", unit: "S-105", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-106", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-107", status: "Active" },
    { property: "Frankfurt Sachsenhausen", unit: "S-108", status: "Active" },
    // S-110 to S-112 Individual Units
    { property: "Frankfurt Sachsenhausen", unit: "S-110", status: "Active" },

    // --- Frankfurt Single Living (10 units: S-101 to S-110) ---
    // S-101 Shared Room
    { property: "Frankfurt Single Living", unit: "S-101 (Bed 1)", status: "Active" },
    { property: "Frankfurt Single Living", unit: "S-101 (Bed 2)", status: "Active" },
    // S-102 Shared Room
    { property: "Frankfurt Single Living", unit: "S-102 (Bed 1)", status: "Active" },
    { property: "Frankfurt Single Living", unit: "S-102 (Bed 2)", status: "Active" },
    // S-103 to S-105 Studio Apartments
    { property: "Frankfurt Single Living", unit: "S-103", status: "Active" },
    { property: "Frankfurt Single Living", unit: "S-104", status: "Active" },
    // S-106 to S-110 Individual Units
    { property: "Frankfurt Single Living", unit: "S-106", status: "Active" },
    { property: "Frankfurt Single Living", unit: "S-107", status: "Active" },
    { property: "Frankfurt Single Living", unit: "S-108", status: "Active" }
  ];

  for (let i = 1; i <= count; i++) {
    const day = 1 + ((i - 1) % 28);
    const role = ROLES[(i - 1) % ROLES.length];
    
    // Assign from our pre-defined assignments list or leave unassigned (Pending)
    const assignment = assignments[i - 1] || { property: null, unit: null, status: "Pending" };

    employees.push({
      id: `emp_${i}`,
      name: `Employee ${i}`,
      role: role,
      arrivingOn: `2026-06-${pad2(day)}`,
      email: `employee${i}@company.com`,
      property: assignment.property,
      unit: assignment.unit,
      status: assignment.status
    });
  }
  return employees;
}

export const MOCK_EMPLOYEES = buildMockEmployees(48);
