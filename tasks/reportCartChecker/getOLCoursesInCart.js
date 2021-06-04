import axios from 'axios';

function normalizeCartCourse(course) {
  const { SKU, title } = course;
  const seatsRemaining = course['Seats Remaining'];
  const url = course['URL alias'];

  return {
    courseId: SKU.split(/\s+/).join('-'),
    SKU,
    title,
    seatsRemaining: Number.parseInt(seatsRemaining, 10),
    url: `https://${url}`,
    nodeId: course.Nid,
  };
}

async function getOLCoursesInCart() {
  try {
    const res = await axios.get('http://mcad.edu/online-stock-report');
    const data = res.data.nodes.map((item) => item.node).map(normalizeCartCourse);
    return data;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

export default getOLCoursesInCart;
