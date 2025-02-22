import { FormProvider, useForm } from 'react-hook-form';

import getSubjectGroupCourseNamesFromClassData from '@academic-portfolio/helpers/getSubjectGroupCourseNamesFromClassData';
import { Drawer, Button } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import Explanation from './components/Explanation';
import PreWeightingAlerts from './components/PreWeightingAlerts';
import SelectType from './components/SelectType';
import Weighting from './components/Weighting';
import useIsTotalValue100Percent from './hooks/useIsTotalValue100Percent';
import useResetFormOnClassDataChange from './hooks/useResetFormOnClassDataChange';

import { prefixPN } from '@scores/helpers';
import useWeightMutation from '@scores/requests/hooks/mutations/useWeightMutation';
import useWeights from '@scores/requests/hooks/queries/useWeights';

export default function WeightConfigDrawer({ class: klass, onClose = noop }) {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer'));
  const form = useForm();

  const { data: weightValue, isLoading } = useWeights({ classId: klass?.id, enabled: !!klass?.id });
  const { mutateAsync: setWeight, isLoading: isRunningMutation } = useWeightMutation();

  const isTotalValue100Percent = useIsTotalValue100Percent({ control: form.control });
  const { subject, courseAndGroupParsed } = getSubjectGroupCourseNamesFromClassData(klass);

  const className = `${subject} - ${courseAndGroupParsed}`;

  useResetFormOnClassDataChange({ weight: weightValue, class: klass, form });

  const onSubmit = async (data) => {
    const dataToSend = {
      type: data.type,
    };

    if (data.type !== 'averages') {
      dataToSend.weights = data.weights.weight;
      dataToSend.applySameValue = data.weights.applySameValue;
      dataToSend.explanation = data.explanation;
    }

    await setWeight({
      class: klass?.id,
      weight: dataToSend,
    });

    onClose();
  };

  return (
    <Drawer opened={!!klass} onClose={onClose}>
      <Drawer.Header title={className} />

      <Drawer.Content loading={isLoading}>
        <FormProvider {...form}>
          <SelectType />
          <PreWeightingAlerts />
          <Weighting class={klass} />
          <Explanation />
        </FormProvider>
      </Drawer.Content>

      <Drawer.Footer>
        <Drawer.Footer.LeftActions>
          <Button variant="link" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Drawer.Footer.LeftActions>
        <Drawer.Footer.RightActions>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            loading={isRunningMutation}
            disabled={!isTotalValue100Percent}
          >
            {t('save')}
          </Button>
        </Drawer.Footer.RightActions>
      </Drawer.Footer>
    </Drawer>
  );
}

WeightConfigDrawer.propTypes = {
  class: PropTypes.shape({
    groups: PropTypes.shape({
      abbreviation: PropTypes.string,
      name: PropTypes.string,
    }),
    subject: PropTypes.shape({
      name: PropTypes.string,
    }),
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    id: PropTypes.string,
  }),
  onClose: PropTypes.func,
};
