export const orderLessons = (userLessons, allLessons) => {
  if (!userLessons) return [];

  const orderedLessons = allLessons.filter((x) =>
    userLessons.some((s) => s.title === x.title)
  );

  return orderedLessons;
};

export const debounce = (fn, time) => {
  let timeout;

  return () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn();
    }, time);
  };
};

export const sendQuery = async (query) => {
  const r = await fetch("http://localhost:8124/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query,
    }),
  });

  const { data } = await r.json();

  return data;
};

