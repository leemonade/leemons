import { useState } from 'react';

import {
  Text,
  Stack,
  Alert,
  Drawer,
  Button,
  FileUpload,
  ContextContainer,
} from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { QuestionsTablePicker } from '@tests/components/QuestionsTablePicker';
import { parseGiftToLeemonsQuestions } from '@tests/helpers/parseGiftToLeemonsQuestions';
import prefixPN from '@tests/helpers/prefixPN';

function GiftImporterDrawer({ isOpen, onClose, onAddQuestions }) {
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
    onClose();
  }

  function onSelectQuestions(questions) {
    setSelectedQuestions(questions);
  }

  const isInvalidFile = error || (processed && questions.length === 0);
  const hasQuestions = processed && questions?.length > 0;

  return (
    <Drawer size="xl" opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('questions')} />
      <Drawer.Content loading={processing}>
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

              <QuestionsTablePicker questions={questions} onSelectQuestions={onSelectQuestions} />
            </Stack>
          )}
        </ContextContainer>
      </Drawer.Content>
      <Drawer.Footer>
        <Drawer.Footer.LeftActions>
          <Button variant="link" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Drawer.Footer.LeftActions>
        <Drawer.Footer.RightActions>
          {hasQuestions && (
            <Button onClick={handleAddQuestions} disabled={!selectedQuestions.length}>
              {t('add')} ({selectedQuestions.length})
            </Button>
          )}
        </Drawer.Footer.RightActions>
      </Drawer.Footer>
    </Drawer>
  );
}

GiftImporterDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddQuestions: PropTypes.func.isRequired,
};

export { GiftImporterDrawer };
