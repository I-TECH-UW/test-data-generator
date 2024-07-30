import { faker } from '@faker-js/faker';
import {
  YES_NO,
  getCHW,
  getCHWSupervisor,
  getChild,
  getDistrictHospital,
  getHealthCenter,
  getHousehold,
  getInfant,
  getPatient,
  getWoman
} from './common.js';
import { getUserDesigns } from './users.js';

const getPregnancyDangerSign = (patient) => {
  return {
    form: 'pregnancy_danger_sign',
    type: 'data_record',
    content_type: 'xml',
    reported_date: faker.date.recent({ days: 5 }).getTime(),
    fields: {
      patient_age_in_years: 34,
      patient_name: patient.name,
      t_danger_signs_referral_follow_up_date: faker.date.recent({ days: 5 }).toISOString(),
      t_danger_signs_referral_follow_up: 'yes', // Intentionally 'yes'
      danger_signs: {
        danger_signs_note: '',
        danger_signs_question_note: '',
        vaginal_bleeding: 'yes', // Intentionally 'yes'
        fits: faker.helpers.arrayElement(YES_NO),
        severe_abdominal_pain: faker.helpers.arrayElement(YES_NO),
        severe_headache: faker.helpers.arrayElement(YES_NO),
        very_pale: faker.helpers.arrayElement(YES_NO),
        fever: faker.helpers.arrayElement(YES_NO),
        reduced_or_no_fetal_movements: faker.helpers.arrayElement(YES_NO),
        breaking_water: faker.helpers.arrayElement(YES_NO),
        easily_tired: faker.helpers.arrayElement(YES_NO),
        face_hand_swelling: faker.helpers.arrayElement(YES_NO),
        breathlessness: faker.helpers.arrayElement(YES_NO),
        r_danger_sign_present: faker.helpers.arrayElement(YES_NO),
        refer_patient_note_1: '',
        refer_patient_note_2: '',
      },
    },
  };
};

export default (context) => {
  return [
    {
      designId: 'district-hospital',
      amount: 2,
      getDoc: () => getDistrictHospital(context),
      children: [
        {
          designId: 'health-center',
          amount: 2,
          getDoc: () => getHealthCenter(context),
          children: [
            {
              designId: 'household',
              amount: 2,
              getDoc: () => getHousehold(context),
              children: [
                {
                  designId: 'woman-person',
                  amount: 1,
                  getDoc: () => getWoman(context),
                  children: [
                    {
                      designId: 'pregnancy-danger-report',
                      amount: 1,
                      getDoc: ({parent}) => getPregnancyDangerSign(parent),
                    }
                  ]
                },
                { designId: 'child-person', amount: 2, getDoc: () => getChild(context) },
                { designId: 'infant-person', amount: 1, getDoc: () => getInfant(context) },
                { designId: 'patient-person', amount: 2, getDoc: () => getPatient(context) }
              ]
            },
            {
              designId: 'chw',
              amount: 1,
              getDoc: () => getCHW(context),
              children: getUserDesigns()
            }
          ]
        },
        {
          designId: 'chw-supervisor',
          amount: 1,
          getDoc: () => getCHWSupervisor(context),
          children: getUserDesigns({ roles: ['chw_supervisor'] })
        }
      ]
    },
  ];
};
