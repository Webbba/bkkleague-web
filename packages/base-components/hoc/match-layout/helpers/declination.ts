const declination = (
  number: number,
  txt: string[],
  cases = [2, 0, 1, 1, 1, 2],
) => {
  const result =
    txt[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];

  return result;
};

export default declination;
