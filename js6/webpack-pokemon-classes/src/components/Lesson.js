import React from 'react';
import { orderLessons } from '../utils.js';
import { sendQuery } from '../utils.js';

const Lesson = type => ({ title, setLessons, lessons }) => {
    const queryType = type === "enroll" ? "enroll" : "unenroll";

    const handleOnClick = async () => {
        const queryResponse = await sendQuery(`mutation {${queryType}(title: "${title}") {name lessons {title}}}`);

        setLessons(orderLessons(queryResponse[queryType].lessons, lessons));

        return queryResponse;
    }

    return <h4 onClick={handleOnClick}>{title}</h4>
}

export default Lesson;