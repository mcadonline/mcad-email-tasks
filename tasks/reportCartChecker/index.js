const { indexBy, prop } = require('ramda');
const path = require('path');
const generateEmails = require('../../lib/generateEmails');
const getOLCoursesInCart = require('./getOLCoursesInCart');
const getOLCoursesInJex = require('./getOLCoursesInJex');

const jexCourseExists = (jexCourse) => !!jexCourse;
const isOnlineCourse = (jexCourse) => jexCourse && jexCourse.room === 'OL';
const seatsRemainingAgree = ({ jexCourse, cartCourse }) =>
  jexCourse && cartCourse && jexCourse.seatsRemaining === cartCourse.seatsRemaining;

// ignore courses that are not OL
// for example courses that have "REM" or a room number
// as they may be remote CE courses or hybrid courses
// if the jexCourse is missing though, include it in our list
// as it suggests that there's a courseId problem with the
// cartCourse
const courseNeedsUpdating = ({ jexCourse, cartCourse }) =>
  (isOnlineCourse(jexCourse) && !seatsRemainingAgree({ jexCourse, cartCourse })) ||
  !jexCourseExists(jexCourse);

function reduceToJexCoursesNotInCart({ cartCourses, jexCourses }) {
  const cartDict = indexBy(prop('courseId'), cartCourses);

  return jexCourses
    .filter((jexCourse) => isOnlineCourse(jexCourse) && !cartDict[jexCourse.courseId])
    .map((jexCourse) => ({
      courseId: jexCourse.courseId,
      title: jexCourse.title,
      url: null,
      jexEnrollment: jexCourse.enrollment,
      jexSeatsRemaining: jexCourse.seatsRemaining,
      cartSeatsRemaining: null,
    }))
    .sort((a, b) => a.jexSeatsRemaining - b.jexSeatsRemaining);
}

function reduceToCartCoursesNeedingUpdate({ cartCourses, jexCourses }) {
  const jexDict = indexBy(prop('courseId'), jexCourses);
  return cartCourses
    .filter((cartCourse) => {
      const { courseId } = cartCourse;
      const jexCourse = jexDict[courseId];
      return courseNeedsUpdating({
        jexCourse,
        cartCourse,
      });
    })
    .map((cartCourse) => {
      const { courseId } = cartCourse;
      const jexCourse = jexDict[courseId];

      return {
        courseId: cartCourse.courseId,
        title: cartCourse.title,
        // url: cartCourse.url,
        // direct link to edit course
        url: `https://mcad.edu/node/${cartCourse.nodeId}/edit`,
        jexEnrollment: jexCourse ? jexCourse.enrollment : 'Not Found. Check Cart SKU',
        jexSeatsRemaining: jexCourse ? jexCourse.seatsRemaining : 'Not Found. Check Cart SKU.',
        cartSeatsRemaining: cartCourse.seatsRemaining,
      };
    })
    .sort((a, b) => {
      const { courseId } = a;
      const jexCourse = jexDict[courseId];
      if (!jexCourse) return Number.POSITIVE_INFINITY;
      return a.jexSeatsRemaining - b.jexSeatsRemaining;
    });
}

function reduceToCartCoursesUpToDate({ cartCourses, jexCourses }) {
  const jexDict = indexBy(prop('courseId'), jexCourses);
  return cartCourses
    .filter((cartCourse) => {
      const { courseId } = cartCourse;
      const jexCourse = jexDict[courseId];
      return isOnlineCourse(jexCourse) && !courseNeedsUpdating({ jexCourse, cartCourse });
    })
    .map((cartCourse) => {
      const { courseId } = cartCourse;
      const jexCourse = jexDict[courseId];

      return {
        courseId: cartCourse.courseId,
        title: cartCourse.title,
        // url: cartCourse.url,
        // direct link to edit course
        url: `https://mcad.edu/node/${cartCourse.nodeId}/edit`,
        jexEnrollment: jexCourse ? jexCourse.enrollment : 'Not Found. Check Cart SKU',
        jexSeatsRemaining: jexCourse ? jexCourse.seatsRemaining : 'Not Found. Check Cart SKU.',
        cartSeatsRemaining: cartCourse.seatsRemaining,
      };
    })
    .sort((a, b) => a.jexSeatsRemaining - b.jexSeatsRemaining);
}

async function task() {
  const cartCourses = await getOLCoursesInCart();
  const jexCourses = await getOLCoursesInJex();

  const jexCoursesNotInCart = reduceToJexCoursesNotInCart({ cartCourses, jexCourses });
  const cartCoursesNeedingUpdate = reduceToCartCoursesNeedingUpdate({ cartCourses, jexCourses });
  const cartCoursesUpToDate = reduceToCartCoursesUpToDate({ cartCourses, jexCourses });

  // single report email
  const records = [
    {
      jexCoursesNotInCart,
      cartCoursesNeedingUpdate,
      cartCoursesUpToDate,
    },
  ];

  const { emails, errors } = await generateEmails({
    template: path.basename(__dirname),
    records,
    to: () => ['"James Johnson" <james_johnson@mcad.edu>'].join(', '),
    from: () => '"OL Cart Checker" <online@mcad.edu>',
  });
  return { emails, errors };
}

module.exports = task;
