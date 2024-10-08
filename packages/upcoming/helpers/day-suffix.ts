const daySuffix = (number: number) => {
  let suffix;
  if (number > 3 && number < 21) {
    suffix = 'th';
  }

  switch (number % 10) {
    case 1:
      suffix = 'st';
      break;
    case 2:
      suffix = 'nd';
      break;
    case 3:
      suffix = 'rd';
      break;
    default:
      suffix = 'th';
      break;
  }

  return suffix;
};

export default daySuffix;
