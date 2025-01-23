import { createStyles, Text } from "@bubbles-ui/components";
import { isNumber } from "lodash";

const useStyles = createStyles((_, { isSelected, isClickable }: { isSelected: boolean, isClickable: boolean }) => ({
  cell: {
    boxShadow: "0px 1px 0px 0px #F2F2F2",
    verticalAlign: "middle",
    textAlign: "center",
    border: isSelected ? "2px solid #B1E400" : "none",
    cursor: isClickable ? 'pointer' : 'default'
  },
}))

interface Props {
  grade: number | null;
  id: string;
  selectedRetake: string;
}

export function GradeCell({grade, selectedRetake, id}: Props) {
  const isSelected = selectedRetake === id;
  const hasGrade = isNumber(grade);
  const isClickable = hasGrade;

  const { classes } = useStyles({ isSelected, isClickable });


  return (
    <td className={classes.cell}>
        <Text>
          {
          hasGrade
          ? grade
          : "-"
        }
      </Text>
    </td>
  )
}
