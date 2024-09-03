function isLRN(str) {
  return /^lrn:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$/.test(str);
}

export { isLRN };
