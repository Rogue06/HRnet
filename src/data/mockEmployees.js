import { states } from "./states";
import { departments } from "./departments";

/**
 * Génère une date aléatoire entre deux dates
 * @param {Date} start - Date de début
 * @param {Date} end - Date de fin
 * @returns {string} - Date au format MM/DD/YYYY
 */
const randomDate = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Génère un employé avec des données aléatoires
 * @returns {Object} - Employé avec des données aléatoires
 */
const generateRandomEmployee = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Emma",
    "William",
    "Olivia",
    "James",
    "Sophia",
    "Robert",
    "Charlotte",
    "David",
    "Amelia",
    "Richard",
    "Mia",
    "Joseph",
    "Harper",
    "Thomas",
    "Evelyn",
    "Charles",
    "Abigail",
    "Daniel",
    "Emily",
    "Matthew",
    "Elizabeth",
    "Anthony",
    "Sofia",
    "Mark",
    "Ella",
    "Donald",
    "Grace",
    "Steven",
    "Camila",
    "Paul",
    "Victoria",
    "Andrew",
    "Chloe",
    "Joshua",
    "Penelope",
    "Kenneth",
    "Riley",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
  ];

  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Indianapolis",
    "Charlotte",
    "San Francisco",
    "Seattle",
    "Denver",
    "Washington",
    "Boston",
    "El Paso",
    "Nashville",
    "Portland",
    "Detroit",
    "Las Vegas",
    "Oklahoma City",
    "Memphis",
    "Louisville",
    "Baltimore",
    "Milwaukee",
  ];

  const streets = [
    "Main St",
    "Oak Ave",
    "Maple Rd",
    "Washington Blvd",
    "Park Ave",
    "Lake St",
    "Pine St",
    "Cedar Ln",
    "Elm St",
    "Highland Ave",
    "River Rd",
    "Spring St",
    "Hillside Ave",
    "Forest Dr",
    "Sunset Blvd",
    "Broadway",
    "Valley Rd",
    "Meadow Ln",
    "Ridge Rd",
    "Church St",
  ];

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomState = states[Math.floor(Math.random() * states.length)];
  const randomDepartment =
    departments[Math.floor(Math.random() * departments.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomStreet = streets[Math.floor(Math.random() * streets.length)];
  const randomStreetNumber = Math.floor(Math.random() * 9000) + 1000;
  const randomZipCode = Math.floor(Math.random() * 90000) + 10000;

  // Date de naissance (18-65 ans)
  const today = new Date();
  const minBirthYear = today.getFullYear() - 65;
  const maxBirthYear = today.getFullYear() - 18;
  const birthStart = new Date(minBirthYear, 0, 1);
  const birthEnd = new Date(maxBirthYear, 11, 31);
  const dateOfBirth = randomDate(birthStart, birthEnd);

  // Date de début (entre 0-20 ans)
  const minStartYear = today.getFullYear() - 20;
  const startStart = new Date(minStartYear, 0, 1);
  const startDate = randomDate(startStart, today);

  return {
    firstName: randomFirstName,
    lastName: randomLastName,
    dateOfBirth: dateOfBirth,
    startDate: startDate,
    street: `${randomStreetNumber} ${randomStreet}`,
    city: randomCity,
    state: randomState.name,
    zipCode: randomZipCode.toString(),
    department: randomDepartment,
  };
};

/**
 * Génère un tableau d'employés factices
 * @param {number} count - Nombre d'employés à générer
 * @returns {Array} - Tableau d'employés
 */
export const generateMockEmployees = (count = 50) => {
  const employees = [];
  for (let i = 0; i < count; i++) {
    employees.push(generateRandomEmployee());
  }
  return employees;
};

// Exporter un ensemble fixe d'employés pour un usage immédiat
export const mockEmployees = generateMockEmployees(50);
