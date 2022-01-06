import React from 'react';
import reactStringReplace from 'react-string-replace';

const Result = ({ name, searchBoxValue, loadSelection }) => {
    const handleClick = () => loadSelection(name);

    const newStr = reactStringReplace(
        name,
        searchBoxValue,
        match => <span class="match">{match}</span>
    );

    return <h3 onClick={handleClick}>{newStr}</h3>;
};

export default Result;