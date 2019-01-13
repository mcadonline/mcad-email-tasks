module.exports = function toHyphenatedCourseCode(courseCode) {
  return courseCode.replace(/\s+/g, '-');
};
