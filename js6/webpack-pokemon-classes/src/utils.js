export const debounce = (fn, time) => {
    let timeout;

    return () => {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            fn()
        }, time)
    }
}

export const sendQuery = async (query) => {
    const r = await fetch("https://js5.c0d3.com/js6c2/graphql", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            operationName: null,
            variables: {},
            query
        }),
    });

    const { data } = await r.json();

    return data;
}

export const replaceStringWithJSX = (string, find, replace) => {
    return string.split(find).map((part, i) => {
      return i % 2 === 0 ? replace : part
    })
  }