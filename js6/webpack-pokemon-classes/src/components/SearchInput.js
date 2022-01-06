import React, { useCallback, useRef, useEffect } from "react";
import { sendQuery, debounce } from "../utils.js";

const SearchInput = ({
  setResults,
  setSearchBoxValue,
  searchBoxValue,
  loadSelection,
  setPokemon,
}) => {
  const searchInput = useRef();

  const searchBoxValueRef = useRef();
  searchBoxValueRef.current = searchBoxValue;

  const runSearch = useCallback(
    debounce(() => {
      searchBoxValueRef.current &&
        sendQuery(`{search(str: "${searchBoxValueRef.current}") {name}}`).then(
          (data) => {
            const results = data.search || [];

            setResults(results);
          }
        );
    }, 500),
    []
  );

  const handleInputKeyUp = (e) => {
    if (e.key === "Enter") return loadSelection(searchBoxValue);
    setPokemon({})
    runSearch();
  };

  useEffect(() => searchInput.current.focus(), []);
  useEffect(
    () => !searchInput.current?.value && setResults([]),
    [searchInput.current?.value]
  );

  return (
    <div>
      <input
        onKeyUp={handleInputKeyUp}
        value={searchBoxValue}
        onChange={(e) => setSearchBoxValue(e.target.value)}
        class="searchBox"
        type="text"
        ref={searchInput}
      />
    </div>
  );
};

export default SearchInput;
