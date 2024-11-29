import { useState } from 'react';

import {
  Box,
  Text,
  Alert,
  Stack,
  Button,
  FileUpload,
  LoadingOverlay,
  ContextContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevronLeftIcon, DownloadIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { QuestionsList } from './QuestionsList';

import { parseGiftToLeemonsQuestions } from '@tests/helpers/parseGiftToLeemonsQuestions';
import prefixPN from '@tests/helpers/prefixPN';

function GiftImporter({ onPrev, scrollRef, onAddQuestions }) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const [questions, setQuestions] = useState([]);
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [error, setError] = useState(null);

  async function processFileContent(file) {
    try {
      setProcessing(true);
      setProcessed(false);
      setError(null);

      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          resolve(event.target.result);
        };

        reader.onerror = (event) => {
          reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
      });

      const parsed = parseGiftToLeemonsQuestions(fileContent);
      setQuestions(parsed);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Error processing file');
    } finally {
      setProcessed(true);
      setProcessing(false);
    }
  }

  async function handleFileChange(file) {
    setError(null);
    setProcessed(false);

    if (file?.path) {
      await processFileContent(file);
    }
  }

  function handleAddQuestions() {
    onAddQuestions(selectedQuestions);
  }

  function onSelectQuestions(questions) {
    setSelectedQuestions(questions);
  }

  const isInvalidFile = error || (processed && questions.length === 0);
  const hasQuestions = processed && questions?.length > 0;

  return (
    <TotalLayoutStepContainer
      stepName={t('questions')}
      TopZone={
        <Box sx={(theme) => ({ paddingBlock: theme.spacing[4] })}>
          <Button
            variant="link"
            leftIcon={<ChevronLeftIcon style={{ width: 12, height: 12 }} />}
            onClick={onPrev}
          >
            {t('backToMain')}
          </Button>
        </Box>
      }
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          rightZone={
            hasQuestions && (
              <Button
                variant="outline"
                onClick={handleAddQuestions}
                disabled={!selectedQuestions.length}
              >
                {t('add')} ({selectedQuestions.length})
              </Button>
            )
          }
        />
      }
    >
      <Box sx={{ position: 'relative' }}>
        <LoadingOverlay visible={processing} />

        <ContextContainer title={t('giftImport.importFile')}>
          {isInvalidFile && (
            <Alert title={t('giftImport.invalidFileTitle')} severity="error" closeable={false}>
              {t('giftImport.invalidFileDescription')}
            </Alert>
          )}
          {!hasQuestions && (
            <FileUpload
              icon={<DownloadIcon height={32} width={32} />}
              title={t('giftImport.fileUploadTitle')}
              subtitle={t('giftImport.fileUploadSubtitle')}
              hideUploadButton
              single
              accept={['text/plain']}
              onChange={handleFileChange}
            />
          )}
          {hasQuestions && (
            <Stack direction="column" spacing={4}>
              <Alert title={questions.length} severity="warning" closeable={false}>
                {t('giftImport.questionsProcessed')}
              </Alert>

              <Text>{t('giftImport.selectQuestions')}</Text>

              <QuestionsList questions={questions} onSelectQuestions={onSelectQuestions} />
            </Stack>
          )}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

GiftImporter.propTypes = {
  onPrev: PropTypes.func.isRequired,
  scrollRef: PropTypes.object.isRequired,
  onAddQuestions: PropTypes.func.isRequired,
};

export { GiftImporter };
