import React from 'react';
import Result from "./Result.js";

const Suggestions = ({ results, searchBoxValue, loadSelection }) => {
    return results.length
        ? results.map(({ name }) => {
            return (
                <Result
                    name={name}
                    searchBoxValue={searchBoxValue}
                    loadSelection={loadSelection}
                />
            );
        })
        : null;
};

export default Suggestions;