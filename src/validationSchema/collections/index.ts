import * as yup from 'yup';

export const collectionValidationSchema = yup.object().shape({
  name: yup.string().required(),
  creation_date: yup.date().required(),
  last_updated: yup.date().required(),
  total_songs: yup.number().integer().required(),
  organization_id: yup.string().nullable().required(),
});
