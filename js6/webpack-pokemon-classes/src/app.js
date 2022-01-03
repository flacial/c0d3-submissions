import React, {
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { sendQuery } from "./utils.js";
import Login from "./views/Login.js";

const Lesson = ({ user }) => {
  const { user: userData, lessons } = user;
  console.log(user, userData)

  return (
    <>
      <h1>${userData.name}</h1>
      <img src={userData.image} />
      <hr />
      <div class="enrolledSection"></div>
      <hr />
      <div class="notEnrolledSection"></div>
    </>
  )
}

const PokemonSearch = () => {
  const [pokemon, setPokemon] = useState({});
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(async () => {
    const queryUserAndLessons = await sendQuery(`{
      user {name, image, lessons {title}},
      lessons {title}
    }`);

    if (queryUserAndLessons.user) {
      setLoggedIn(true);
      setUser({
        user: queryUserAndLessons.user,
        lessons: queryUserAndLessons.lessons
      });
    }
  }, [loggedIn]);

  return (
    loggedIn && user.user ? <Lesson user={user} /> : (
      <>
        <h1>Pokemon Search</h1>
        <Login pokemon={pokemon} setPokemon={setPokemon} setLoggedIn={setLoggedIn} />
      </>
    )
  )
};

ReactDOM.render(<PokemonSearch />, document.getElementById("root"));