function isFilePathNameValid(filePathName) {
  const filterArr = filePathName.split("/");

  const REGEX_PATTERN = /^[A-Za-z0-9\w\s_.-]*$/g;

  const filterName = filterArr[filterArr.length - 1];

  const noSpecialChars = REGEX_PATTERN.test(filterName);

  return noSpecialChars;
}

module.exports = isFilePathNameValid;
