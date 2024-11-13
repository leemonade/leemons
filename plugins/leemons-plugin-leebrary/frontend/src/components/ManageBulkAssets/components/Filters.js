import { useState, useEffect } from 'react';

import { SubjectItem } from '@academic-portfolio/components/SelectSubject';
import { useSubjects } from '@academic-portfolio/hooks';
import { Stack, SearchInput, Select, Button, Box } from '@bubbles-ui/components';
import { RemoveCircleIcon } from '@bubbles-ui/icons/outline';
import propTypes from 'prop-types';

import getResourceTypeDisplay from '@leebrary/helpers/getResourceTypeDisplay';

const Filters = ({ assets, onFiltersChange, t }) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const typeOptions = [
    { label: t('filters.typeAll'), value: 'all' },
    ...Array.from(
      new Set(
        assets.map((asset) => {
          const { displayLabel } = getResourceTypeDisplay(asset);
          return displayLabel;
        })
      )
    ).map((label) => ({ label, value: label })),
  ];

  const subjectIds = Array.from(
    new Set(
      assets
        .filter((asset) => asset.subjects && Array.isArray(asset.subjects))
        .flatMap((asset) => asset.subjects)
        .map((subject) => subject.subject)
        .filter(Boolean) // Eliminamos posibles undefined/null
    )
  );

  const subjects = useSubjects(subjectIds) || { data: [] }; // Aseguramos que tenga la estructura correcta
  const enrichedAssets = assets.map((asset) => {
    if (!asset.subjects || !Array.isArray(asset.subjects)) {
      return asset;
    }

    return {
      ...asset,
      subjects: asset.subjects
        .map((assetSubject) => {
          if (!assetSubject || !assetSubject.subject) return assetSubject;

          const fullSubject = Array.isArray(subjects.data)
            ? subjects.data.find((s) => s.id === assetSubject.subject)
            : null;

          return fullSubject ? { ...assetSubject, ...fullSubject } : assetSubject;
        })
        .filter(Boolean),
    };
  });

  const subjectOptions = enrichedAssets
    .filter((asset) => asset.subjects && Array.isArray(asset.subjects) && asset.subjects.length > 0)
    .flatMap((asset) => asset.subjects)
    .reduce((acc, subject) => {
      if (!acc.find((item) => item.value === subject.id)) {
        acc.push({
          value: subject.id,
          label: subject.name,
          subject,
        });
      }
      return acc;
    }, []);

  const tagOptions = [
    ...new Set(
      assets
        .filter((asset) => asset.tags?.length)
        .flatMap((asset) => asset.tags)
        .map((tag) => ({ label: tag, value: tag }))
    ),
  ];

  useEffect(() => {
    const filteredAssets = selectedSubject
      ? assets.filter((asset) =>
          asset.subjects?.some((subject) => subject.subject === selectedSubject[0])
        )
      : assets;

    onFiltersChange({
      search,
      type: selectedType,
      subject: selectedSubject,
      tags: selectedTags,
      filteredAssets,
    });
  }, [search, selectedType, selectedSubject, selectedTags]);

  const handleClear = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedSubject(null);
    setSelectedTags([]);
  };

  return (
    <Stack spacing={4} alignItems="center">
      <SearchInput
        label={t('filters.searchLabel')}
        placeholder={`${t('filters.searchLabel')}...`}
        value={search}
        onChange={(e) => setSearch(e)}
        wait={500}
      />
      <Select
        label={t('filters.typeLabel')}
        data={typeOptions}
        value={selectedType}
        onChange={setSelectedType}
        clearable
      />
      <Select
        label={t('filters.subjectLabel')}
        data={subjectOptions}
        value={selectedSubject}
        onChange={(value) => {
          setSelectedSubject(value);
        }}
        valueComponent={(item) => {
          return (
            <SubjectItem
              {...item}
              isValueComponent
              subject={subjectOptions.find((s) => s.value === item.value)?.subject}
            />
          );
        }}
        itemComponent={(item) => {
          return (
            <SubjectItem
              {...item}
              subject={subjectOptions.find((s) => s.value === item.value)?.subject}
            />
          );
        }}
        clearable
      />
      <Select
        label={t('filters.tagsLabel')}
        data={tagOptions}
        value={selectedTags}
        onChange={(value) => setSelectedTags(value)}
        multiple
        clearable
      />

      <Box mt={24}>
        <Button variant="linkInline" leftIcon={<RemoveCircleIcon />} onClick={handleClear}>
          {t('filters.clearLabel')}
        </Button>
      </Box>
    </Stack>
  );
};

Filters.propTypes = {
  assets: propTypes.array.isRequired,
  onFiltersChange: propTypes.func.isRequired,
};

export { Filters };
