import { useCallback, useEffect, useMemo } from 'react';
import { isFunction } from 'lodash';
import { Scorm12API, Scorm2004API } from '@scorm/lib';

export function useScorm({ state, scormPackage, onInitialize, onTerminate, onSetValue }) {
  const { version: scormVersion } = scormPackage ?? {};

  const settings = useMemo(
    () => ({
      autocommit: false,
    }),
    []
  );

  const scormInstance = useMemo(() => {
    if (!scormPackage) {
      return null;
    }

    // SCORM 2004
    if (scormVersion.indexOf('2004') > 0) {
      const scorm = new Scorm2004API(settings);
      window.API = scorm;
      window.API_1484_11 = scorm;

      if (state) {
        scorm.loadFromJSON(state, '');
      }

      if (isFunction(onInitialize)) {
        scorm.on('Initialize', onInitialize);
      }

      if (isFunction(onTerminate)) {
        scorm.on('Terminated', onTerminate);
      }

      if (isFunction(onSetValue)) {
        scorm.on('SetValue.cmi.*', onSetValue);
      }

      return scorm;
    }
    // SCORM 1.2
    if (scormVersion.indexOf('scorm') > -1) {
      const scorm = new Scorm12API(settings);
      window.API = scorm;

      if (state) {
        scorm.loadFromJSON(state, '');
      }

      if (isFunction(onInitialize)) {
        scorm.on('LMSInitialize', onInitialize);
      }

      if (isFunction(onTerminate)) {
        scorm.on('LMSFinish', onTerminate);
      }

      if (isFunction(onSetValue)) {
        scorm.on('LMSSetValue.cmi.*', onSetValue);
      }

      return scorm;
    }

    return null;
  }, [settings, scormVersion]);

  return { scormInstance, isLoading: !scormInstance };
}

export function useScormUnloadHandler({ scormPackage }) {
  const onUnload = useCallback(() => {
    if (scormPackage && window.API && isFunction(window.API.isTerminated)) {
      const isTerminated = window.API.isTerminated();
      const isInitiated = window.API.isInitialized();
      const { version: scormVersion } = scormPackage;

      if (isInitiated && !isTerminated) {
        // SCORM 2004
        if (scormVersion.indexOf('2004') > 0) {
          window.API.SetValue('cmi.core.exit', 'suspend'); // Set exit to whatever is needed
          window.API.Commit(''); // save all data that has already been set
          window.API.Terminate(''); // close the SCORM API connection properly
        }

        // SCORM 1.2
        else if (scormVersion.indexOf('scorm') > -1) {
          window.API.LMSSetValue('cmi.core.exit', 'suspend'); // Set exit to whatever is needed
          window.API.LMSCommit(''); // save all data that has already been set
          window.API.LMSTerminate(''); // close the SCORM API connection properly
        }
      }

      window.API = undefined;
      window.API_1484_11 = undefined;
      return false;
    }

    return false;
  }, [scormPackage]);

  useEffect(() => onUnload, [scormPackage]);
}
