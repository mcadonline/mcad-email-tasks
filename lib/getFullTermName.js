const getFullTermName = (term) => {
  if (term === 'FA') return 'Fall';
  if (term === 'SP') return 'Spring';
  if (term === 'ST') return 'Summer';
  return null;
};

export default getFullTermName;
