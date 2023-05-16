function getDictionary() {
  function validateDictionary(dictionary) {
    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary.indexOf(dictionary[i]) !== dictionary.lastIndexOf(dictionary[i])) {
        console.log(
          'Error: The dictionary in use has at least one repeating symbol:',
          dictionary[i]
        );
        return undefined;
      }
    }
    return dictionary;
  }

  return validateDictionary('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

function numberToEncodedLetter(_number) {
  // Takes any number and converts it into a base (dictionary length) letter combo. 0 corresponds to an empty string.
  // It converts any numerical entry into a positive integer.
  if (Number.isNaN(_number)) {
    return undefined;
  }
  const number = Math.abs(Math.floor(_number));

  const dictionary = getDictionary();
  let index = number % dictionary.length;
  let quotient = number / dictionary.length;
  let result;

  function numToLetter(num) {
    // Takes a letter between 0 and max letter length and returns the corresponding letter
    if (num > dictionary.length || num < 0) {
      return undefined;
    }
    if (num === 0) {
      return '';
    }
    return dictionary.slice(num - 1, num);
  }

  if (number <= dictionary.length) {
    return numToLetter(number);
  } // Number is within single digit bounds of our encoding letter alphabet

  if (quotient >= 1) {
    // This number was bigger than our dictionary, recursively perform this function until we're done
    if (index === 0) {
      quotient--;
    } // Accounts for the edge case of the last letter in the dictionary string
    result = numberToEncodedLetter(quotient);
  }

  if (index === 0) {
    index = dictionary.length;
  } // Accounts for the edge case of the final letter; avoids getting an empty string

  return result + numToLetter(index);
}

module.exports = numberToEncodedLetter;
