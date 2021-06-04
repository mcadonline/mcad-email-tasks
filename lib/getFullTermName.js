const getFullTermName = (term) => {
  if (term === 'FA') return 'Fall';
  if (term === 'SP') return 'Spring';
  if (term === 'SU') return 'Summer';
  return null;
};

export default getFullTermName;
