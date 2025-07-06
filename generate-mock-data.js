const { faker } = require('@faker-js/faker');
const fs = require('fs');

function generateCustomers(count = 1000) {
  const customers = [];
  const states = ['California', 'Florida', 'Texas', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
  const companies = ['Tech Corp', 'Global Solutions', 'Innovation Ltd', 'Digital Systems', 'Smart Industries', 'Future Tech', 'Advanced Solutions', 'Premier Services', 'Elite Systems', 'Next Gen'];

  for (let i = 1; i <= count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const state = faker.helpers.arrayElement(states);
    
    customers.push({
      id: i,
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      company: faker.helpers.arrayElement(companies),
      job_title: faker.person.jobTitle(),
      state: state,
      city: faker.location.city(),
      address: faker.location.streetAddress(),
      zip_code: faker.location.zipCode(),
      avatar_url: faker.image.avatar(),
      registration_date: faker.date.between({ from: '2020-01-01', to: '2024-12-31' }).toISOString(),
      last_login: faker.date.recent({ days: 30 }).toISOString(),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
      revenue: faker.number.int({ min: 1000, max: 100000 }),
      notes: faker.lorem.sentence()
    });
  }

  return customers;
}

const customers = generateCustomers(1000);

// Create JSON Server compatible format
const jsonServerData = {
  customers: customers
};

fs.writeFileSync('./src/assets/data/customers.json', JSON.stringify(jsonServerData, null, 2));
console.log(`Generated ${customers.length} customer records`);
