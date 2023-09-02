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

import { createCollection } from 'apiSdk/collections';
import { collectionValidationSchema } from 'validationSchema/collections';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { CollectionInterface } from 'interfaces/collection';

function CollectionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CollectionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCollection(values);
      resetForm();
      router.push('/collections');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CollectionInterface>({
    initialValues: {
      name: '',
      creation_date: new Date(new Date().toDateString()),
      last_updated: new Date(new Date().toDateString()),
      total_songs: 0,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: collectionValidationSchema,
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
              label: 'Collections',
              link: '/collections',
            },
            {
              label: 'Create Collection',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Collection
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

          <FormControl id="creation_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Creation Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.creation_date ? new Date(formik.values?.creation_date) : null}
              onChange={(value: Date) => formik.setFieldValue('creation_date', value)}
            />
          </FormControl>
          <FormControl id="last_updated" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Last Updated
            </FormLabel>
            <DatePicker
              selected={formik.values?.last_updated ? new Date(formik.values?.last_updated) : null}
              onChange={(value: Date) => formik.setFieldValue('last_updated', value)}
            />
          </FormControl>

          <NumberInput
            label="Total Songs"
            formControlProps={{
              id: 'total_songs',
              isInvalid: !!formik.errors?.total_songs,
            }}
            name="total_songs"
            error={formik.errors?.total_songs}
            value={formik.values?.total_songs}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_songs', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            labelField={'name'}
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
              onClick={() => router.push('/collections')}
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
    entity: 'collection',
    operation: AccessOperationEnum.CREATE,
  }),
)(CollectionCreatePage);
