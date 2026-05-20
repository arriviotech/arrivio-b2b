const fs = require('fs');
const path = require('path');

// Read the existing file
const filePath = path.join(__dirname, 'src', 'data', 'propertiesData.js');
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Extract the MOCK_PROPERTIES array using regex or simple parsing
const propertiesStart = fileContent.indexOf('export const MOCK_PROPERTIES = [');
const propertiesEnd = fileContent.indexOf('];', propertiesStart) + 2;
const propertiesString = fileContent.substring(propertiesStart, propertiesEnd)
  .replace('export const MOCK_PROPERTIES = ', '');

// We need to evaluate the string, but it has variable references like img1, img2...
// We can temporarily replace them with strings to parse it
const parseableString = propertiesString.replace(/image: (img\d+)/g, 'image: "$1"');
let properties = JSON.parse(parseableString);

// Remove 'individual' from all properties and update totalUnits
properties = properties.map(prop => {
  const newBreakdown = { ...prop.breakdown };
  delete newBreakdown.individual;
  
  // Recalculate total units based on remaining types
  const newTotalUnits = (newBreakdown.studio || 0) + (newBreakdown.shared || 0);

  return {
    ...prop,
    totalUnits: newTotalUnits,
    breakdown: newBreakdown
  };
});

// Add 1 individual property for each city
const cities = ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Bonn', 'Cologne', 'Aachen', 'Dusseldorf'];
let newId = properties.length + 1;

cities.forEach(city => {
  const individualUnits = Math.floor(Math.random() * 15) + 5;
  const randomImageId = Math.floor(Math.random() * 24) + 1;
  const imageVarName = `img${randomImageId}`;

  properties.push({
    id: newId++,
    name: `${city} Single Living`,
    neighborhood: `${city} Central`,
    city: city,
    image: imageVarName, // Temporarily a string, will be reverted
    totalUnits: individualUnits,
    breakdown: { individual: individualUnits },
    price: Math.floor(Math.random() * 500) + 700
  });
});

// Convert back to string and revert image variable strings back to actual variables
let updatedPropertiesString = JSON.stringify(properties, null, 2);
updatedPropertiesString = updatedPropertiesString.replace(/"image": "(img\d+)"/g, 'image: $1');

// Reconstruct the file content
const newFileContent = fileContent.substring(0, propertiesStart) + 
  'export const MOCK_PROPERTIES = ' + updatedPropertiesString + 
  fileContent.substring(propertiesEnd);

fs.writeFileSync(filePath, newFileContent);
console.log('Done!');
