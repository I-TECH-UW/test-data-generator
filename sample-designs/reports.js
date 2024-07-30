import { faker } from '@faker-js/faker'; // API Reference: https://fakerjs.dev/api

export default (context) => {
  return [
    {
      amount: 340, // This creates 340 reports
      getDoc: () => ({
        type: 'data_record',
        form: 'pregnancy_facility_visit_reminder',
        fields: {
          patient_name: faker.person.firstName(),
        },
      }),
    },
    {
      amount: 30, // This creates 30 hospitals
      getDoc: () => ({
        type: 'district_hospital',
        name: `${ faker.location.city() }'s hospital`,
      }),
      children: [
        {
          amount: 15, // This creates 15 people per each hospital
          getDoc: () => ({
            type: 'person',
            name: faker.person.firstName(),
          }),
        }
      ]
    },
  ];
};
