import React, {
  useEffect,
  useState
} from "react";
import ReactDOM from "react-dom";
import { sendQuery } from "./utils.js";
import Login from "./views/Login.js"
import Lessons from "./views/Lessons.js";

const PokemonSearch = () => {
  const [pokemon, setPokemon] = useState({});
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(null);

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

      return;
    }

    setLoggedIn(false);
  }, [loggedIn]);

  return (
    loggedIn && user.user ?
      <Lessons user={user} /> :
      (
        loggedIn === false && <Login pokemon={pokemon} setPokemon={setPokemon} setLoggedIn={setLoggedIn} />
      )
  )
};

ReactDOM.render(<PokemonSearch />, document.getElementById("root"));