export default function toHyphenatedCourseCode(courseCode) {
  return courseCode.replace(/\s+/g, '-');
}
