import { useState } from "react";

import { Box, ImageLoader, TLayout } from "@bubbles-ui/components";
import { useSearchParams } from "@common";
import { useNavigate } from "react-router-dom";

import { SelectProgram } from "@academic-portfolio/components";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import evaluationsIcon from "@scores/../public/menu-icon.svg";
import Weights from "@scores/components/Weights/Weights";
import { prefixPN } from "@scores/helpers";
import { useUserCenters } from "@users/hooks";

export default function WeightsPage() {
  const [t] = useTranslateLoader(prefixPN("weighting"));
  const queryParams = useSearchParams();
  const navigate = useNavigate();

  const [selectedProgram, setSelectedProgram] = useState(
    queryParams.get("program")
  );

  const { data: userCenter } = useUserCenters({
    select: (centers) => centers[0].id,
  });

  return (
    <TLayout>
      <TLayout.Header
        cancelable={false}
        title={t("title")}
        icon={
          <Box sx={{ position: "relative", width: 20, height: 20 }}>
            <ImageLoader src={evaluationsIcon} />
          </Box>
        }
      >
        <SelectProgram
          center={userCenter}
          firstSelected
          value={selectedProgram}
          onChange={(program) => {
            setSelectedProgram(program);

            if (program) {
              const newParams = new URLSearchParams(queryParams);
              newParams.set("program", program);
              navigate({ search: newParams.toString() }, { replace: true });
            }
          }}
        />
      </TLayout.Header>
      <TLayout.Content>
        <Weights program={selectedProgram} />
      </TLayout.Content>
    </TLayout>
  );
}
