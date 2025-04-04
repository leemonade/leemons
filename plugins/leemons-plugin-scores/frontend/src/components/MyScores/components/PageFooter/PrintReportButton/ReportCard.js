import { forwardRef, useEffect, useMemo } from "react";

import { useAcademicCalendarConfig } from "@academic-calendar/hooks";
import {
  Box,
  Stack,
  Text,
  Logo,
  ImageLoader,
  Title,
} from "@bubbles-ui/components";
import { useLocale } from "@common/LocaleDate";
import useProgramEvaluationSystems from "@grades/hooks/queries/useProgramEvaluationSystem";
import { useLayout } from "@layout/context";
import useTranslateLoader from "@multilanguage/useTranslateLoader";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import getUserFullName from "@users/helpers/getUserFullName";
import { useUserAgentsInfo, useUserDatasets } from "@users/hooks";
import useUserAgents from "@users/hooks/useUserAgents";
import { isEmpty, keyBy, noop } from "lodash";
import PropTypes from "prop-types";

import { ContentToPrintStyles } from "./ContentToPrint.styles";

import { prefixPN } from "@scores/helpers";
import getNearestScale from "@scores/helpers/getNearestScale";
import useMyScoresStore from "@scores/stores/myScoresStore";

const ReportCard = forwardRef(({ onLoading = noop }, ref) => {
  const { classes } = ContentToPrintStyles({}, { name: "ContentToPrint" });
  const [t] = useTranslateLoader(prefixPN("myScores"));
  const [tNotebook] = useTranslateLoader(prefixPN("notebook"));
  const { theme } = useLayout();
  const locale = useLocale();

  const finalScores = useMyScoresStore((store) => store.finalScores);
  const filters = useMyScoresStore((store) => store.filters);
  const classrooms = useMyScoresStore((store) => keyBy(store.classes, "id"));

  console.log("finalScores:", finalScores);
  console.log("classrooms:", classrooms);

  // USER DATA ·······················
  const userAgents = useUserAgents();
  const { data: userAgentsInfo } = useUserAgentsInfo(userAgents?.[0], {
    enabled: !!userAgents?.[0],
  });

  const userInfo = userAgentsInfo?.[0]?.user;
  const userId = userInfo?.id;

  // FINAL SCORES ·······················
  const finalScoresFromClassrooms = useMemo(() => {
    if (!finalScores) {
      return null;
    }

    const classroomIds = Object.keys(classrooms);

    return Array.from(finalScores).reduce((acc, [classroomId, value]) => {
      if (classroomIds.includes(classroomId)) {
        acc.set(classroomId, value);
      }
      return acc;
    }, new Map());
  }, [finalScores, classrooms]);

  const currentPeriod = filters?.period?.selected;

  // PROGRAM DATA ·······················
  const programData = useMemo(() => {
    if (!filters?.program || !classrooms) {
      return null;
    }

    const classroom = Object.values(classrooms).find(
      (classroom) => classroom.program.id === filters?.program
    );

    return classroom?.program;
  }, [filters?.program, classrooms]);

  const courseData = useMemo(() => {
    if (!filters?.course || !programData?.courses) {
      return null;
    }

    return programData.courses.find((course) => course.id === filters?.course);
  }, [filters?.course, programData]);

  const { data: academicCalendar } = useAcademicCalendarConfig(
    filters?.program,
    {
      enabled: !!filters?.program,
    }
  );

  // EVALUATION SYSTEM ·······················
  const {
    data: evaluationSystem,
    isLoading: isLoadingProgramEvaluationSystems,
  } = useProgramEvaluationSystems({
    program: filters?.program,
    options: {
      enabled: !!filters?.program,
    },
  });

  // USER DATASET ·······················
  const { data: userDatasets, isLoading: isLoadingUserDatasets } =
    useUserDatasets({
      userIds: [userId],
      enabled: userId?.length > 0,
    });

  const userDataset = useMemo(() => {
    const data = userDatasets?.[0]?.data ?? {};
    if (!data.jsonSchema?.properties || !data.value) {
      return [];
    }

    return Object.keys(data.jsonSchema.properties).reduce((acc, key) => {
      // Only include properties that have a value
      if (data.value[key]?.value !== undefined) {
        acc.push({
          title: data.jsonSchema.properties[key].title,
          value: data.value[key].value,
        });
      }
      return acc;
    }, []);
  }, [userDatasets]);

  // ·························································
  // EFFECTS

  useEffect(() => {
    onLoading(isLoadingProgramEvaluationSystems || isLoadingUserDatasets);
  }, [isLoadingProgramEvaluationSystems, isLoadingUserDatasets, onLoading]);

  // ·························································
  // HEADER DATA

  const programTitle = useMemo(() => {
    if (!programData) {
      return "";
    }

    return [programData.abbreviation, programData.name]
      .filter(Boolean)
      .join(" - ");
  }, [programData]);

  const courseTitle = useMemo(() => {
    if (!courseData) {
      return "";
    }
    let yearTitle = "";
    const courseDates = academicCalendar?.courseDates?.[courseData.id];

    if (courseDates) {
      const startYear = new Date(courseDates?.startDate).getFullYear();
      const endYear = new Date(courseDates?.endDate).getFullYear();
      yearTitle = startYear === endYear ? startYear : `${startYear}-${endYear}`;
    }

    return [t("filters.course"), yearTitle].filter(Boolean).join(" ");
  }, [courseData, academicCalendar, t]);

  const averageScore = useMemo(() => {
    if (!finalScoresFromClassrooms?.size) {
      return 0;
    }

    // Filter out null grades and calculate average
    const validScores = Array.from(finalScoresFromClassrooms.values()).filter(
      (score) => score.grade !== null
    );

    if (validScores.length === 0) {
      return 0;
    }

    const result =
      validScores.reduce((acc, score) => acc + score.grade, 0) /
      validScores.length;

    return result.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [finalScoresFromClassrooms, locale]);

  const totalCredits = useMemo(() => {
    return Object.values(classrooms).reduce(
      (acc, classroom) => acc + classroom.subject?.credits,
      0
    );
  }, [classrooms]);

  const totalCreditsWithPromotion = useMemo(() => {
    return Object.values(classrooms).reduce((acc, classroom) => {
      const scaleToPromote = evaluationSystem?.minScaleToPromote?.number ?? 0;
      const grade = finalScoresFromClassrooms.get(classroom.id)?.grade ?? 0;
      return acc + (grade >= scaleToPromote ? classroom.subject?.credits : 0);
    }, 0);
  }, [classrooms, evaluationSystem, finalScoresFromClassrooms]);

  // ·························································
  // RECORDS TABLE

  const showSubjectTypeColumn = useMemo(() => {
    return Object.values(classrooms).some(
      (classroom) => classroom.subjectType?.name
    );
  }, [classrooms]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("code", {
        header: t("reportCardTable.code"),
        cell: (info) => <Text>{info.getValue()}</Text>,
      }),
      columnHelper.accessor("subject", {
        header: t("reportCardTable.subject"),
        cell: (info) => <Text>{info.getValue()}</Text>,
      }),
    ];

    if (showSubjectTypeColumn) {
      baseColumns.push(
        columnHelper.accessor("type", {
          header: t("reportCardTable.subjectType"),
          cell: (info) => <Text>{info.getValue()}</Text>,
        })
      );
    }

    baseColumns.push(
      columnHelper.accessor("credits", {
        header: t("reportCardTable.credits"),
        cell: (info) => <Text>{info.getValue()}</Text>,
      }),
      columnHelper.accessor("retake", {
        header: t("reportCardTable.retake"),
        cell: (info) => {
          if (info.getValue() !== null) {
            return (
              <Text>
                {t("retake")} {info.getValue()}
              </Text>
            );
          }
          return <Text>-</Text>;
        },
      }),
      columnHelper.accessor("score", {
        header: t("reportCardTable.score"),
        cell: (info) => <Text>{info.getValue()}</Text>,
      })
    );

    return baseColumns;
  }, [columnHelper, t, showSubjectTypeColumn]);

  const tableData = useMemo(() => {
    if (!classrooms || !finalScoresFromClassrooms) return [];

    return Object.values(classrooms).map((classroom) => {
      const scoreData = finalScoresFromClassrooms.get(classroom.id);
      const grade = scoreData?.grade ?? null;
      const retakeIndex =
        scoreData?.retakeIndex > -1 ? scoreData?.retakeIndex + 1 : null;
      const nearestScale =
        grade !== null ? getNearestScale({ grade, evaluationSystem }) : null;
      const scaleToPromote = evaluationSystem?.minScaleToPromote?.number ?? 0;
      const formattedGrade =
        grade !== null
          ? grade.toLocaleString(locale, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          : "-";

      return {
        code: classroom.subject?.internalId ?? "",
        subject: classroom.subject?.name ?? "",
        type: classroom.subjectType?.description
          ? classroom.subjectType?.description
          : (classroom.subjectType?.name ?? ""),
        credits: grade >= scaleToPromote ? classroom.subject?.credits : 0,
        retake: retakeIndex,
        score: nearestScale?.description
          ? `${nearestScale.description.toUpperCase()} (${formattedGrade})`
          : (formattedGrade ?? `(${t("pendingEvaluation")})`),
      };
    });
  }, [classrooms, t, finalScoresFromClassrooms, evaluationSystem, locale]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ·························································
  // RENDER

  return (
    <Box ref={ref} className={classes.printEditor}>
      {/* Header */}
      <Stack justifyContent="space-between" alignItems="start">
        <Box noFlex>
          {!isEmpty(theme?.logoUrl) ? (
            <ImageLoader
              src={theme?.logoUrl}
              forceImage
              className={classes.logo}
              height="auto"
            />
          ) : (
            <Logo className={classes.logo} />
          )}
        </Box>
        <Title order={2}>{t("reportCard")}</Title>
      </Stack>

      {/* User Info */}
      {userInfo && (
        <Box sx={{ marginTop: 20 }}>
          <Title order={3}>{getUserFullName(userInfo)}</Title>
        </Box>
      )}

      {/* User dataset */}
      {userDataset.length > 0 && (
        <Box>
          {userDataset.map((item) => (
            <Box key={item.title}>
              <Stack spacing={2}>
                <Text>
                  <strong>{item.title}:</strong>
                </Text>
                <Text>
                  <strong>{item.value}</strong>
                </Text>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      {/* Program data */}
      {programData && (
        <Box sx={{ marginTop: 10 }}>
          <Box>
            <Text>
              <strong>{programTitle}</strong>
            </Text>
          </Box>
          <Box>
            <Text>
              <strong>{courseTitle}</strong> ({courseData.name}) -{" "}
              {currentPeriod.name}
            </Text>
          </Box>
        </Box>
      )}

      {/* Credits data */}
      <Stack spacing={2}>
        <Text>
          {t("promotedCredits")}: <strong>{totalCreditsWithPromotion}</strong>
        </Text>
        <Text>/</Text>
        <Text>
          {t("totalCredits")}: <strong>{totalCredits}</strong>
        </Text>
      </Stack>

      {/* Scores data */}
      {finalScoresFromClassrooms && (
        <Box>
          <Text>
            {tNotebook("students.averageScore")}:{" "}
            <strong>{averageScore}</strong>
          </Text>
        </Box>
      )}

      {/* Scores Table */}
      <Box sx={{ marginTop: 20 }}>
        <table className={classes.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
});

ReportCard.displayName = "ReportCard";

ReportCard.propTypes = {
  onLoading: PropTypes.func,
};

export { ReportCard };
