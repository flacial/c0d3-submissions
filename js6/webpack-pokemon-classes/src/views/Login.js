import React, {
    useState,
    useMemo,
    useCallback,
    useRef
} from "react";
import { sendQuery, debounce, replaceStringWithJSX } from "../utils.js";

const Login = ({ pokemon, setPokemon, setLoggedIn }) => {
    const [results, setResults] = useState([]);
    const [searchBoxValue, setSearchBoxValue] = useState("");

    const loadSelection = async (name) => {
        const queryResult = await sendQuery(`{getPokemon(str:"${name}"){name, image}}`);

        setPokemon(queryResult.getPokemon);

        return queryResult;
    }

    const handleLogin = async () => {
        const queryResponse = await sendQuery(`{login (pokemon: "${pokemon.name}") {name}}`);

        if (queryResponse.login.name) return setLoggedIn(true);

        return queryResponse;
    }

    // Prevent suggestions from rendering multiple times.
    const MemoizedSuggestions = useMemo(() => <Suggestions searchBoxValue={searchBoxValue} results={results} loadSelection={loadSelection} />, [results])

    return (
        <>
            <SearchInput
                setResults={setResults}
                setSearchBoxValue={setSearchBoxValue}
                searchBoxValue={searchBoxValue}
                loadSelection={loadSelection}
            />
            {
                pokemon?.name ?
                    <>
                        <h1>{pokemon.name}</h1>
                        <img src={pokemon.image} />
                        <button onClick={handleLogin} class="continue">Login</button>
                    </>
                    : MemoizedSuggestions
            }
        </>
    )
}

const Result = ({ name, searchBoxValue, loadSelection }) => {
    const handleClick = () => loadSelection(name)

    const newStr = replaceStringWithJSX(name, searchBoxValue, <span class='match'>{searchBoxValue}</span>)

    return <h3 onClick={handleClick}>{newStr}</h3>
}

const Suggestions = ({ results, searchBoxValue, loadSelection }) => {
    return results.length ? results.map(({ name }) => {
        return <Result
            name={name}
            searchBoxValue={searchBoxValue}
            loadSelection={loadSelection}
        />
    }) : null
}


const SearchInput = ({ setResults, setSearchBoxValue, searchBoxValue, loadSelection }) => {
    const searchBoxValueRef = useRef();
    searchBoxValueRef.current = searchBoxValue;

    const runSearch = useCallback(debounce(() => {
        sendQuery(`{search(str: "${searchBoxValueRef.current}") {name}}`).then(data => {
            const results = data.search || []

            setResults(results);
        })
    }, 2000), [])

    const handleInputKeyUp = (e) => {
        if (e.key === 'Enter') {
            return loadSelection(searchBoxValue);
        }

        runSearch()
    }

    return (
        <div>
            <input onKeyUp={handleInputKeyUp} value={searchBoxValue} onChange={(e) => setSearchBoxValue(e.target.value)} class="searchBox" type="text" />
        </div>
    )
}

export default Login;