import * as yup from 'yup';

export const artistValidationSchema = yup.object().shape({
  name: yup.string().required(),
  birth_date: yup.date().required(),
  genre: yup.string().required(),
  debut_year: yup.number().integer().required(),
  song_id: yup.string().nullable().required(),
});
