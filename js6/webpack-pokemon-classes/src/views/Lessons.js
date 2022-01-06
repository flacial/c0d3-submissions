import React, {
    useEffect,
    useState
} from "react";
import Lesson from "../components/Lesson.js";
import { orderLessons } from "../utils.js";

const Lessons = ({ user }) => {
    const { user: userData, lessons } = user;
    const [enrolledLessons, setEnrolledLessons] = useState(orderLessons(userData.lessons, lessons));
    const [notEnrolledLessons, setNotEnrolledLessons] = useState([]);

    useEffect(() => {
        const filterNotEnrolled = lessons.filter(x => !enrolledLessons.some(s => s.title === x.title));

        setNotEnrolledLessons(filterNotEnrolled);
    }, [enrolledLessons])

    const mapLessonsToType = (typeLessons, Component, setLessons, lessons) => {
        return typeLessons.map(title => {
            return (
                <Component
                    lessons={lessons}
                    setLessons={setLessons}
                    title={title.title || title}
                />
            )
        })
    }

    const renderLessonSection = (lessonSectionName, setEnrolledLessons) => {
        const lessonProps = lessonSectionName === "enrolledSection" ? [enrolledLessons, "enroll"] : [notEnrolledLessons, "unenroll"];
        const queryType = lessonProps[1] === "enroll" ? "unenroll" : "enroll";

        return (
            <div className={lessonSectionName}>
                {
                    lessonProps[0].length ? (
                        <>
                            <h2>{lessonProps[1] === "unenroll" && "Not"} Enrolled</h2>
                            <p>Click to {lessonProps[1]}</p>
                            {mapLessonsToType(lessonProps[0], Lesson(queryType), setEnrolledLessons, lessons)}
                        </>
                    ) : null
                }
            </div>
        )
    }

    return (
        <>
            <h1>{userData.name}</h1>
            <img src={userData.image} />
            <hr />
            <div className="lessonsContainer">
                {renderLessonSection("enrolledSection", setEnrolledLessons)}
                <hr />
                {renderLessonSection("notEnrolledSection", setEnrolledLessons)}
            </div>
        </>
    )
}

export default Lessons;