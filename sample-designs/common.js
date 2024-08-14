import { faker } from '@faker-js/faker';

export const YES_NO = [ 'yes', 'no' ];

export const getPlace = (context, type, nameSuffix) => {
  return {
    type,
    name: `${faker.location.city()}'s ${nameSuffix}`,
    external_id: faker.string.alphanumeric(5),
    notes: faker.lorem.lines(2),
    meta: {
      created_by: context.username,
      created_by_person_uuid: '',
      created_by_place_uuid: ''
    },
    reported_date: faker.date
      .recent({ days: 20 })
      .getTime(),
  };
};

export const getDistrictHospital = context => getPlace(context, 'district_hospital', 'Hospital');
export const getHealthCenter = context => getPlace(context, 'health_center', 'Health Center');
export const getHousehold = context => getPlace(context, 'clinic', 'Household');

export const getPerson = (context, role, { sex = faker.person.sex(), ageRange = { min: 20, max: 60 } } = {}) => {
  const dobRaw = faker.date.birthdate({ mode: 'age', ...ageRange});
  const dobFormatted = `${dobRaw.getFullYear()}-${dobRaw.getMonth()}-${dobRaw.getDay()}`;
  return {
    type: 'person',
    name: faker.person.fullName(),
    short_name: faker.person.middleName(),
    date_of_birth: dobFormatted,
    date_of_birth_method: '',
    ephemeral_dob: {
      dob_calendar: dobFormatted,
      dob_method: '',
      dob_approx: dobRaw.toISOString(),
      dob_raw: dobFormatted,
      dob_iso: dobFormatted
    },
    sex,
    phone: faker.helpers.fromRegExp(/[+]2547[0-9]{8}/),
    phone_alternate: '',
    role: role,
    external_id:'',
    notes: '',
    meta: {
      created_by: context.username,
      created_by_person_uuid: '',
      created_by_place_uuid: ''
    },
    reported_date: faker.date.recent({ days: 25 }).getTime(),
  };
};

export const getCHWSupervisor = context => ({
  ...getPerson(context, 'chw_supervisor'),
  username: `super${faker.number.int(10000)}`
});
export const getCHW = context => ({
  ...getPerson(context, 'chw'),
  username: `chw${faker.number.int(10000)}`
});
export const getPatient = context => getPerson(context, 'patient', { ageRange: { min: 13, max: 23 }});
export const getWoman = context => getPerson(context, 'patient', { sex: 'female', ageRange: { min: 15, max: 45 } });
export const getChild = context => getPerson(context, 'patient', { ageRange: { min: 0, max: 14 } });
export const getInfant = context => getPerson(context, 'patient', { ageRange: { min: 0, max: 1 } });
