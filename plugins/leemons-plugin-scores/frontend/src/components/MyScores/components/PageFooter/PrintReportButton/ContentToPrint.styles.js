import { createStyles } from "@bubbles-ui/components";

const ContentToPrintStyles = createStyles((theme) => ({
  printEditor: {
    width: "210mm",
    minHeight: "297mm",
    padding: "15mm",
    margin: "0 auto",
    backgroundColor: "white",

    "@media print": {
      width: "100%",
      height: "auto",
      margin: 0,
      padding: 0,

      "@page": {
        size: "A4",
        margin: "15mm",
      },

      "& > div": {
        width: "100%",
        height: "auto",
        columnFill: "auto",
      },

      img: {
        maxWidth: "100%",
        height: "auto !important",
        objectFit: "contain",
        display: "block",
        verticalAlign: "middle",
        marginBottom: "0.5rem",
      },

      h1: {
        fontSize: "24px",
        marginTop: "16px",
        marginBottom: "12px",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      },

      h3: {
        fontSize: "18px",
        marginTop: "12px",
        marginBottom: "8px",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      },

      p: {
        margin: "0 0 8px 0",
        breakInside: "avoid",
        pageBreakInside: "avoid",
        lineHeight: 1.5,
      },

      "*": {
        color: "#0d0d0d",
        boxSizing: "border-box",
      },

      ".content-section": {
        breakInside: "avoid",
        pageBreakInside: "avoid",
        margin: "0.5rem 0",
      },

      ".non-printable-content": {
        border: "1px solid black !important",
        borderRadius: "8px !important",
        padding: "10px !important",
        margin: "10px 0 !important",
        display: "block !important",
        width: "100% !important",
      },
    },
  },
  logo: {
    maxWidth: "310px",
    height: "auto !important",
    objectFit: "contain",
    display: "block",
    verticalAlign: "top",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: theme.spacing[4],

    "& th, & td": {
      borderBottom: `1px solid ${theme.colors.gray[3]}`,
      padding: theme.spacing[2],
      textAlign: "left",
    },

    "& th": {
      fontWeight: 600,
    },
  },
}));
export { ContentToPrintStyles };
