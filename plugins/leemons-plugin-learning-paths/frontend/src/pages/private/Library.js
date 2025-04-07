import { useMemo, useState } from "react";

import { Box, ContextContainer, TabPanel, Tabs, createStyles } from "@bubbles-ui/components";
// TODO: import from @common plugin
import { AdminPageHeader } from "@bubbles-ui/leemons";

import { get } from "lodash";
import { useNavigate } from "react-router-dom";

import useAcademicFiltersForAssetList from "@assignables/hooks/useAcademicFiltersForAssetList";
import { unflatten, useQuery as useQueryParams } from "@common";
import { prefixPN } from "@learning-paths/helpers";
import AssetList from "@leebrary/components/AssetList";
import { prepareAsset } from "@leebrary/helpers/prepareAsset";
import useTranslateLoader from "@multilanguage/useTranslateLoader";

export function useLibraryPageLocalizations() {
  // key is string
  const key = prefixPN("libraryPage");
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, key, {});
    }

    return {};
  });
}

const useLibraryStyles = createStyles((theme) => ({
  pageContainer: {
    display: "flex",
  },
  tabs: {
    display: "flex",
    flex: 1,
  },
  tabPane: {
    display: "flex",
    flex: 1,
    height: "100%",
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

export default function LibraryPage() {
  const navigate = useNavigate();
  const { tab: selectedTab } = useQueryParams();
  const localizations = useLibraryPageLocalizations();

  const academicFilters = useAcademicFiltersForAssetList();
  const [currentAsset, setCurrentAsset] = useState(null);

  const handleOnNewModule = () => {
    navigate("/private/learning-paths/modules/new");
  };
  const handleOnSelectModule = (item) => {
    if (currentAsset?.id !== item?.id) {
      setCurrentAsset(prepareAsset(item));
    }
  };

  const { classes } = useLibraryStyles();

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: localizations?.header?.title,
        }}
        buttons={localizations?.header?.buttons}
        onNew={handleOnNewModule}
        fullWidth
      />
      <Tabs
        usePageLayout
        panelColor="solid"
        fullHeight
        fullWidth
        activeKey={selectedTab}
        onTabClick={(tab) => {
          navigate(`?tab=${tab}`, { replace: true });
          setCurrentAsset(null);
        }}
      >
        <TabPanel label={localizations?.tabs?.published}>
          <Box className={classes.tabPane}>
            <AssetList
              {...academicFilters}
              canShowPublicToggle={false}
              published
              showPublic
              asset={currentAsset}
              variant="embedded"
              category="assignables.learningpaths.module"
              onSelectItem={handleOnSelectModule}
              roles={["owner", "assigner"]}
            />
          </Box>
        </TabPanel>
        <TabPanel label={localizations?.tabs?.draft}>
          <Box className={classes.tabPane}>
            <AssetList
              {...academicFilters}
              canShowPublicToggle={false}
              published={false}
              showPublic
              asset={currentAsset}
              variant="embedded"
              category="assignables.learningpaths.module"
              onSelectItem={handleOnSelectModule}
              roles={["owner", "assigner"]}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </ContextContainer>
  );
}
