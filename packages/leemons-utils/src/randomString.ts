import crypto from "crypto";

/**
 * Generate long random string
 * @param size - The size of the random string to generate (default: 32)
 * @returns A random string of the specified size
 */
function randomString(size: number = 32): string {
  return `rs${crypto.webcrypto
    .getRandomValues(new Uint8Array(size - 2))
    .reduce(
      (t, e) =>
        (t +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
              ? (e - 26).toString(36).toUpperCase()
              : e > 62
                ? "-"
                : "_"),
      ""
    )}`;
}

export { randomString };
