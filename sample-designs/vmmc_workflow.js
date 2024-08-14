import { faker } from '@faker-js/faker';
import {
  getChild,
  getCHW,
  getCHWSupervisor,
  getDistrictHospital,
  getHealthCenter,
  getHousehold,
  getInfant,
  getPatient
} from './common.js';
import { getUserDesigns } from './users.js';

const enrollNewPerson = (patient) => {
  const languages = ['english', 'isizulu', 'setswana'];
  const mobileCompanies = ['mtn', 'vodacom', 'cellc', 'telcom', 'other'];
  const wagePeriods = ['daily', 'weekly', 'monthly', 'none'];
  const consentOptions = ['yes', 'no'];
  const randomizationResults = ['texting', 'routine'];
  
  return {
    form: 'enroll',
    type: 'data_record',
    content_type: 'xml',
    reported_date: faker.date.recent({ days: 40 }).getTime(),
    fields: {
      patient_name: patient.name,
      phone: patient.phone || faker.phone.number(),
      patient_uuid: patient.uuid,
      place_id: faker.string.uuid(),
      language_preference: faker.helpers.arrayElement(languages),
      randomization: faker.helpers.arrayElement(randomizationResults),
      editing: faker.helpers.arrayElement(['yes', 'no']),
      forbid: {
        n_edit: faker.lorem.sentence()
      },
      person: {
        parent: {
          _id: faker.string.uuid(),
          parent: {
            _id: faker.string.uuid()
          }
        },
        type: 'person',
        role: 'patient',
        name: patient.name,
        vmmc_no: faker.string.uuid(),
        study_no: faker.number.int({ min: 1000, max: 9999 }),
        n_study: faker.lorem.word(),
        consent: faker.helpers.arrayElement(consentOptions),
        randomization: faker.helpers.arrayElement(randomizationResults),
        phone: patient.phone || faker.phone.number(),
        confirm: faker.helpers.arrayElement(['yes']),
        language_preference: faker.helpers.arrayElement(languages),
        mobile_company: faker.helpers.arrayElement(mobileCompanies),
        mobile_other: faker.lorem.word(),
        transport_cost: faker.number.int({ min: 0, max: 1000 }),
        clinic_trip: {
          hours: faker.number.int({ min: 0, max: 23 }),
          minutes: faker.number.int({ min: 0, max: 59 })
        },
        food_cost: faker.number.int({ min: 0, max: 500 }),
        wage_period: faker.helpers.arrayElement(wagePeriods),
        wage_amount: faker.number.int({ min: 0, max: 10000 })
      }
    },
    inputs: {
      source: 'user',
      source_id: faker.string.uuid(),
      is_task: faker.lorem.word(),
      contact: {
        _id: faker.string.uuid(),
        name: patient.name,
        phone: patient.phone || faker.phone.number(),
        parent: {
          _id: faker.string.uuid()
        }
      }
    }
  };
};

const getDailySMSReceived = (patient, day) => {
  const smsResponses = ['1', '0', 'bad text'];
    
  return {
    form: `day${day}_sms`,
    type: 'data_record',
    content_type: 'xml',
    reported_date: faker.date.recent({ days: 15 - day }).getTime(),
    fields: {
      patient_name: patient.name,
      phone: patient.phone || faker.phone.number(),
      patient_id: patient._id,
      patient_sms: {
        response: faker.helpers.arrayElement(smsResponses),
        comments: faker.lorem.sentence()
      }
    },
    inputs: {
      source: 'user',
      source_id: faker.string.uuid(),
      contact: {
        _id: patient._id,
        name: patient.name,
        phone: patient.phone || faker.phone.number()
      }
    }
  };
};

const getVMMCClientVisit = (patient) => {
  const districts = ['ekurhuleni', 'bojanala'];
  const sites = {
    ekurhuleni: ['winnie_mandela'],
    bojanala: ['bafokeng', 'letlhabile', 'mogwase', 'bapong']
  };
  const visits = ['circumcision', 'day2', 'day7', 'day14', 'day42', 'additional'];
  const aeSeverity = ['no', 'mild', 'moderate', 'severe'];
  const reviewers = ['team', 'nurse'];
    
  const selectedDistrict = faker.helpers.arrayElement(districts);
  const selectedVisit = faker.helpers.arrayElement(visits);
  
  const aeCodePrefix = faker.helpers.arrayElement(['AN', 'BL', 'IN', 'OT', 'PA', 'SD', 'SX', 'WD', 'OA']);
  const aeCodeSuffix = faker.helpers.arrayElement(['A', 'B', 'C']);
    
  return {
    form: 'client_visit',
    type: 'data_record',
    content_type: 'xml',
    reported_date: faker.date.recent({ days: 3 }).getTime(),
    fields: {
      patient_name: patient.name,
      phone: faker.phone.number(),
      patient_id: patient._id,
      visit: selectedVisit,
      phone_credit: selectedVisit === 'day14' ? faker.helpers.arrayElement(['yes', 'no']) : undefined,
      explanation: faker.lorem.sentence(), // This will be filled conditionally
      visit_date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      location: {
        district: selectedDistrict,
        site: faker.helpers.arrayElement(sites[selectedDistrict])
      },
      reviewer: faker.helpers.arrayElement(reviewers),
      ae_severity: faker.helpers.arrayElement(aeSeverity),
      ae_code: `${aeCodePrefix}-${aeCodeSuffix}`, // This will be filled conditionally
      care_provider: faker.person.fullName(),
      comments: faker.lorem.sentence()
    }
  };
};

const getDay8NoContact = (patient, day) => {
  const clientOkOptions = ['yes', 'no', 'unknown'];
  const selectedClientOk = faker.helpers.arrayElement(clientOkOptions);
  
  return {
    form: `day${day}_no_contact`,
    type: 'data_record',
    content_type: 'xml',
    reported_date: faker.date.recent({ days: 15 - day }).getTime(),
    fields: {
      patient_name: patient.name,
      patient_id: patient._id,
      phone: patient.phone || faker.phone.number(),
      n: {
        client_ok: selectedClientOk,
        additional_notes: generateAdditionalNotes(selectedClientOk)
      }
    },
    inputs: {
      source: 'user',
      source_id: faker.string.uuid(),
      contact: {
        _id: patient._id,
        name: patient.name,
        phone: patient.phone || faker.phone.number()
      }
    }
  };
};
  
const generateAdditionalNotes = (clientOkStatus) => {
  switch (clientOkStatus) {
    case 'yes':
      return faker.lorem.sentence() + ' No follow-up needed.';
    case 'no':
      return faker.lorem.sentence() + ' Client needs care. ' + faker.lorem.sentence();
    case 'unknown':
      return 'Unable to reach client. ' + faker.lorem.sentence() + ' Further tracing required.';
    default:
      return faker.lorem.sentence();
  }
};

const getPotentialAe = (patient) => {
  const daysPostMCOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', 'other'];
  const symptomsOptions = ['bleeding', 'swelling', 'pus', 'pain', 'wound_opening', 'redness', 'other'];
  const followupRequestOptions = ['phone', 'text', 'none'];
  const followupMethodOptions = ['phone', 'text', 'none'];
  const aeOptions = ['yes', 'no'];
  const severityOptions = ['mild', 'moderate', 'severe'];
  const clientReturnOptions = ['yes', 'no'];

  const selectedDayPostMC = faker.helpers.arrayElement(daysPostMCOptions);
  const selectedSymptoms = faker.helpers.arrayElements(
    symptomsOptions,
    faker.number.int({ min: 1, max: symptomsOptions.length })
  );
  const selectedAE = faker.helpers.arrayElement(aeOptions);
  const selectedClientReturn = faker.helpers.arrayElement(clientReturnOptions);

  return {
    form: 'potential_ae',
    type: 'data_record',
    content_type: 'xml',
    reported_date: faker.date.recent({ days: 13 }).getTime(),
    fields: {
      patient_name: patient.name,
      phone: patient.phone || faker.phone.number(),
      patient_id: patient._id,
      note: {
        g_post_mc: {
          days_post_mc: selectedDayPostMC,
          specify: selectedDayPostMC === 'other' ? faker.lorem.word() : ''
        },
        g_symptoms: {
          symptoms: selectedSymptoms.join(', '),
          other_symptom: selectedSymptoms.includes('other') ? faker.lorem.words(2) : ''
        },
        followup_request: faker.helpers.arrayElement(followupRequestOptions),
        followup_method: faker.helpers.arrayElement(followupMethodOptions),
        ae: selectedAE,
        severity: selectedAE === 'yes' ? faker.helpers.arrayElement(severityOptions) : '',
        info: faker.lorem.sentence(),
        client_return: selectedClientReturn,
        explanation: selectedClientReturn === 'no' ? faker.lorem.sentence() : ''
      }
    },
    inputs: {
      source: 'user',
      source_id: faker.string.uuid(),
      contact: {
        _id: patient._id,
        name: patient.name,
        phone: patient.phone || faker.phone.number()
      }
    }
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
                  designId: 'patient-person',
                  amount: 1,
                  getDoc: () => getPatient(context),
                  children: [
                    {
                      designId: 'enroll-report',
                      amount: 50,
                      getDoc: ({parent}) => enrollNewPerson(parent),
                    },
                    {
                      designId: 'daily-report',
                      amount: 50,
                      getDoc: ({parent}) => getDailySMSReceived(parent, 2),
                    },
                    {
                      designId: 'daily-report',
                      amount: 50,
                      getDoc: ({parent}) => getDailySMSReceived(parent, 7),
                    },
                    {
                      designId: 'no-contact-report',
                      amount: 50,
                      getDoc: ({parent}) => getDay8NoContact(parent, 8),
                    },
                    {
                      designId: 'no-contact-report',
                      amount: 50,
                      getDoc: ({parent}) => getDay8NoContact(parent, 14),
                    },
                    {
                      designId: 'client-visit-report',
                      amount: 50,
                      getDoc: ({parent}) => getVMMCClientVisit(parent),
                    },
                    {
                      designId: 'potential-ae-report',
                      amount: 60,
                      getDoc: ({parent}) => getPotentialAe(parent),
                    },
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
