import React, { useState, useMemo } from "react";
import { sendQuery } from "../utils.js";
import SearchInput from "../components/SearchInput.js";
import Suggestions from "../components/Suggestions.js";

const Login = ({ pokemon, setPokemon, setLoggedIn }) => {
  const [results, setResults] = useState([]);
  const [searchBoxValue, setSearchBoxValue] = useState("");

  const loadSelection = async (name) => {
    const queryResult = await sendQuery(
      `{getPokemon(str:"${name}"){name, image}}`
    );

    setResults([]);
    setPokemon(queryResult.getPokemon);

    return queryResult;
  };

  const handleLogin = async () => {
    const queryResponse = await sendQuery(
      `{login (pokemon: "${pokemon.name}") {name}}`
    );

    if (queryResponse.login.name) return setLoggedIn(true);

    return queryResponse;
  };

  // Prevent suggestions from rendering multiple times.
  const MemoizedSuggestions = useMemo(
    () => (
      <Suggestions
        searchBoxValue={searchBoxValue}
        results={results}
        loadSelection={loadSelection}
      />
    ),
    [results]
  );

  return (
    <>
      <h1>Pokemon Search</h1>
      <SearchInput
        setResults={setResults}
        setSearchBoxValue={setSearchBoxValue}
        searchBoxValue={searchBoxValue}
        loadSelection={loadSelection}
        setPokemon={setPokemon}
      />
      {pokemon?.name ? (
        <>
          <h1>{pokemon.name}</h1>
          <img src={pokemon.image} />
          <button onClick={handleLogin} class="continue">
            Login
          </button>
        </>
      ) : (
        MemoizedSuggestions
      )}
    </>
  );
};

export default Login;
