import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createArtist } from 'apiSdk/artists';
import { artistValidationSchema } from 'validationSchema/artists';
import { SongInterface } from 'interfaces/song';
import { getSongs } from 'apiSdk/songs';
import { ArtistInterface } from 'interfaces/artist';

function ArtistCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ArtistInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createArtist(values);
      resetForm();
      router.push('/artists');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ArtistInterface>({
    initialValues: {
      name: '',
      birth_date: new Date(new Date().toDateString()),
      genre: '',
      debut_year: 0,
      song_id: (router.query.song_id as string) ?? null,
    },
    validationSchema: artistValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Artists',
              link: '/artists',
            },
            {
              label: 'Create Artist',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Artist
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="birth_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Birth Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.birth_date ? new Date(formik.values?.birth_date) : null}
              onChange={(value: Date) => formik.setFieldValue('birth_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.genre}
            label={'Genre'}
            props={{
              name: 'genre',
              placeholder: 'Genre',
              value: formik.values?.genre,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Debut Year"
            formControlProps={{
              id: 'debut_year',
              isInvalid: !!formik.errors?.debut_year,
            }}
            name="debut_year"
            error={formik.errors?.debut_year}
            value={formik.values?.debut_year}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('debut_year', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<SongInterface>
            formik={formik}
            name={'song_id'}
            label={'Select Song'}
            placeholder={'Select Song'}
            fetcher={getSongs}
            labelField={'title'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/artists')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'artist',
    operation: AccessOperationEnum.CREATE,
  }),
)(ArtistCreatePage);
