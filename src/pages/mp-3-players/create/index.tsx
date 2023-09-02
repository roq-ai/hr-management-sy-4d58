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

import { createMp3Player } from 'apiSdk/mp-3-players';
import { mp3PlayerValidationSchema } from 'validationSchema/mp-3-players';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { Mp3PlayerInterface } from 'interfaces/mp-3-player';

function Mp3PlayerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: Mp3PlayerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMp3Player(values);
      resetForm();
      router.push('/mp-3-players');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<Mp3PlayerInterface>({
    initialValues: {
      model: '',
      manufacturer: '',
      storage_capacity: 0,
      battery_life: 0,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: mp3PlayerValidationSchema,
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
              label: 'Mp 3 Players',
              link: '/mp-3-players',
            },
            {
              label: 'Create Mp 3 Player',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Mp 3 Player
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.model}
            label={'Model'}
            props={{
              name: 'model',
              placeholder: 'Model',
              value: formik.values?.model,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.manufacturer}
            label={'Manufacturer'}
            props={{
              name: 'manufacturer',
              placeholder: 'Manufacturer',
              value: formik.values?.manufacturer,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Storage Capacity"
            formControlProps={{
              id: 'storage_capacity',
              isInvalid: !!formik.errors?.storage_capacity,
            }}
            name="storage_capacity"
            error={formik.errors?.storage_capacity}
            value={formik.values?.storage_capacity}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('storage_capacity', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Battery Life"
            formControlProps={{
              id: 'battery_life',
              isInvalid: !!formik.errors?.battery_life,
            }}
            name="battery_life"
            error={formik.errors?.battery_life}
            value={formik.values?.battery_life}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('battery_life', Number.isNaN(valueNumber) ? 0 : valueNumber)
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
              onClick={() => router.push('/mp-3-players')}
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
    entity: 'mp3_player',
    operation: AccessOperationEnum.CREATE,
  }),
)(Mp3PlayerCreatePage);
