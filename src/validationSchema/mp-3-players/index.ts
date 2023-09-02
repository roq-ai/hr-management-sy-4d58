import * as yup from 'yup';

export const mp3PlayerValidationSchema = yup.object().shape({
  model: yup.string().required(),
  manufacturer: yup.string().required(),
  storage_capacity: yup.number().integer().required(),
  battery_life: yup.number().integer().required(),
  organization_id: yup.string().nullable().required(),
});
