import * as _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  DatasetItemDrawerCentersContext,
  DatasetItemDrawerContext,
} from './DatasetItemDrawerContext';
import { Badge, Button, Select } from 'leemons-ui';
import { XIcon } from '@heroicons/react/outline';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { listCentersRequest } from '@users/request';
import update from 'immutability-helper';
import { useAsync } from '@common/useAsync';

export const DatasetItemDrawerCenters = ({ onChange = () => {} }) => {
  const { t, tCommon, item, form } = useContext(DatasetItemDrawerContext);
  const { setState: setStateCenters, centers } = useContext(DatasetItemDrawerCentersContext);
  const [isAllCenterMode, setIsAllCenterMode] = useState(
    item && item.id && item.frontConfig ? item.frontConfig.isAllCenterMode : true
  );
  const [selectedCenters, setSelectedCenters] = useState(
    item && item.id && item.frontConfig ? item.frontConfig.centers : []
  );
  const [currentSelectValue, setCurrentSelectValue] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError, ErrorAlert] = useRequestErrorMessage();

  const centersById = useMemo(() => _.keyBy(centers, 'id'), [centers]);

  const load = useMemo(
    () => () =>
      listCentersRequest({
        page: 0,
        size: 99999,
        withRoles: { columns: ['id'] },
      }),
    []
  );

  const onSuccess = useMemo(
    () => ({ data }) => {
      setStateCenters({ centers: data.items });
      setLoading(false);
    },
    []
  );

  const onError = useMemo(
    () => (e) => {
      setError(e);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  useEffect(() => {
    setTimeout(() => sendOnChange(), 10);
  }, []);

  useEffect(() => {
    sendOnChange();
  }, [isAllCenterMode, selectedCenters]);

  const toggleCenterMode = () => {
    setIsAllCenterMode(!isAllCenterMode);
  };

  const sendOnChange = () => {
    onChange({ isAllCenterMode, centers: selectedCenters });
  };

  const selectItem = () => {
    if (currentSelectValue === 'all') {
      setSelectedCenters([]);
      setIsAllCenterMode(true);
      setCurrentSelectValue('...');
    } else {
      setSelectedCenters([...selectedCenters, currentSelectValue]);
      setCurrentSelectValue('...');
    }
  };

  const removeCenterFromSelected = (centerId) => {
    const index = selectedCenters.indexOf(centerId);
    setSelectedCenters(
      update(selectedCenters, {
        $splice: [[index, 1]],
      })
    );
  };

  return (
    <>
      <ErrorAlert />
      <div className="flex flex-row items-center">
        <div className="flex flex-row w-7/12 items-center justify-between">
          <div className="text-sm text-secondary font-medium mr-6">{t('centers')}</div>
          <div className="w-6/12">
            {isAllCenterMode ? (
              <Badge outlined={true}>
                <XIcon
                  className="inline-block w-4 h-4 mr-2 stroke-current cursor-pointer"
                  onClick={toggleCenterMode}
                />
                {t('all_centers')}
              </Badge>
            ) : (
              <div>
                <Select
                  outlined={true}
                  className="w-full max-w-xs"
                  value={currentSelectValue}
                  onChange={(event) => {
                    if (event.target.value !== '...') {
                      setCurrentSelectValue(event.target.value);
                    }
                  }}
                >
                  <option value="...">{t('select_one_value')}</option>
                  <option value="all">{t('all_centers')}</option>
                  {centers
                    ? centers.map((center) => {
                        if (selectedCenters.indexOf(center.id) < 0) {
                          return (
                            <option key={center.id} value={center.id}>
                              {center.name}
                            </option>
                          );
                        }
                        return null;
                      })
                    : null}
                </Select>
              </div>
            )}
          </div>
        </div>
        {!isAllCenterMode && currentSelectValue && currentSelectValue !== '...' ? (
          <div className="ml-3">
            <Button type="button" text color="primary" onClick={selectItem}>
              {t('add_center')}
            </Button>
          </div>
        ) : null}
      </div>
      {selectedCenters && selectedCenters.length ? (
        <div className="mt-6 flex flex-row space-x-2 ">
          {selectedCenters.map((selectedCenter) => (
            <Badge key={selectedCenter} outlined={true}>
              <XIcon
                className="inline-block w-4 h-4 mr-2 stroke-current cursor-pointer"
                onClick={() => removeCenterFromSelected(selectedCenter)}
              />
              {centersById[selectedCenter]?.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </>
  );
};
