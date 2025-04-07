import { Box, PageHeader, TabPanel, Tabs, createStyles } from "@bubbles-ui/components";
import { useQuery, useStore } from "@common";
import { DocumentIcon } from "@content-creator/components";
import prefixPN from "@content-creator/helpers/prefixPN";
import AssetList from "@leebrary/components/AssetList";
import { prepareAsset } from "@leebrary/helpers/prepareAsset";
import useCommonTranslate from "@multilanguage/helpers/useCommonTranslate";
// import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import { getPermissionsWithActionsIfIHaveRequest } from "@users/request";
import React from "react";
import { useNavigate } from "react-router-dom";

const ListPageStyles = createStyles((theme) => ({
  tabPane: {
    display: "flex",
    flex: 1,
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

export default function List() {
  const [t] = useTranslateLoader(prefixPN("documentList"));
  const { t: tCommon } = useCommonTranslate("page_header");
  const [currentAsset, setCurrentAsset] = React.useState(null);
  const { fromDraft } = useQuery();

  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 10,
  });

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest([
      "content-creator.creator",
    ]);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes("create") ||
        permissions[0].actionNames.includes("admin");
      render();
    }
  }

  function goCreatePage() {
    navigate("/private/content-creator/new");
  }

  function goDetailPage(asset) {
    if (currentAsset?.id !== asset?.id) {
      setCurrentAsset(prepareAsset(asset));
    }
  }

  React.useEffect(() => {
    getPermissions();
  }, []);

  const { classes } = ListPageStyles({});

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHeader
        values={{
          title: t("pageTitle"),
        }}
        icon={<DocumentIcon />}
        buttons={store.canAdd ? { new: tCommon("new") } : {}}
        onNew={() => goCreatePage()}
        fullWidth
      />
      <Tabs
        defaultActiveKey={fromDraft ? "1" : "0"}
        panelColor="solid"
        usePageLayout
        fullWidth
        fullHeight
        onTabClick={() => setCurrentAsset(null)}
      >
        <TabPanel label={t("published")}>
          <Box className={classes.tabPane}>
            <AssetList
              canShowPublicToggle={false}
              published={true}
              asset={currentAsset}
              showPublic
              variant="embedded"
              category="assignables.content-creator"
              onSelectItem={goDetailPage}
              roles={["owner"]}
            />
          </Box>
        </TabPanel>
        <TabPanel label={t("draft")}>
          <Box className={classes.tabPane}>
            <AssetList
              canShowPublicToggle={false}
              published={false}
              asset={currentAsset}
              showPublic
              variant="embedded"
              category="assignables.content-creator"
              onSelectItem={goDetailPage}
              roles={["owner"]}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
}
