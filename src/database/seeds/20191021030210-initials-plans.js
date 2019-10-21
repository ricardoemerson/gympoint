
module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'plans',
    [
      {
        title: 'Start',
        duration: 1,
        price: 129.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Gold',
        duration: 3,
        price: 109.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Diamond',
        duration: 6,
        price: 89.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {},
  ),

  down: queryInterface => queryInterface.bulkDelete('plans', null, {}),
};
