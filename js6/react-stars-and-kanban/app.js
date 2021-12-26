const Stars = () => {
  const STARS_COUNT = 5;

  const [activeStars, setActiveStars] = React.useState(0);
  const [gaveRating, setGaveRating] = React.useState(false);
  const [mouseLeft, setMouseLeft] = React.useState(false);

  const Star = ({ active, index }) => {
    const handleStarHover = () => {
      if (mouseLeft) {
        setMouseLeft(false);
        setGaveRating(false);
      }

      if (!gaveRating) {
        setActiveStars(index);
      }
    };

    const handleStarClick = () => {
      setGaveRating(true);
      setActiveStars(index);
    }

    return (
      <i
        className={`fa-star ${active ? "yellow fas" : "far"}`}
        onMouseOver={handleStarHover}
        onClick={handleStarClick}>
      </i>
    )
  }

  const generateStars = (generateCount, activeStars, c = 1, stars = []) => {
    if (c > generateCount) return stars;

    stars.push(<Star key={c} index={c} active={c <= activeStars} />);

    return generateStars(generateCount, activeStars, c + 1, stars);
  }

  const handleMouseLeave = () => {
    setMouseLeft(true);
  }

  return (
    <>
      <div className="stars_container" onMouseLeave={handleMouseLeave}>
        {generateStars(STARS_COUNT, activeStars)}
      </div>
      <p className="stars_info">
        You {gaveRating ? "have given" : "are giving"} {activeStars} star{activeStars > 1 ? "s" : ""}!
      </p>
    </>
  )
}

const Kanban = () => {
  const boards = [
    {
      title: "To-Do",
      items: [],
      titleColor: "#35235D",
    },
    {
      title: "Doing",
      items: [],
      titleColor: "#CB2402",
    },
    {
      title: "Done",
      items: [],
      titleColor: "#4C49A2",
    },
    {
      title: "Approved",
      items: [],
      titleColor: "#A31A48",
    },
  ]

  const [localBoards, setLocalBoards] = React.useState(JSON.parse(localStorage.getItem("todos") || JSON.stringify(boards)));

  const updateLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const moveTodo = (todoIndex, boardIndex, direction = "next") => {
    setLocalBoards(prevState => {
      const nextLocalBoards = [...prevState];
      const board = (boardIndex) => nextLocalBoards[boardIndex].items;
      const todo = board(boardIndex)[todoIndex];

      const to = direction === "next" ? boardIndex + 1 : boardIndex - 1;

      // Remove from current board and move the todo to next/previous one.
      board(boardIndex).splice(todoIndex, 1);
      board(to).push(todo);

      updateLocalStorage("todos", localBoards);

      return nextLocalBoards
    })

    return localBoards;
  }

  const deleteTodo = (todoIndex, boardIndex) => {
    setLocalBoards(prevState => {
      const nextLocalBoards = [...prevState];
      const board = nextLocalBoards[boardIndex].items;

      // Remove the todo in board
      board.splice(todoIndex - 1, 1);

      updateLocalStorage("todos", localBoards);

      return nextLocalBoards
    })

    return localBoards;
  }

  const TodoInput = ({ todoInput, handleTodoInputChange }) => {
    return <textarea name="todoItem" id="todoItem" cols="30" rows="5" value={todoInput} onChange={handleTodoInputChange}></textarea>
  }

  const SubmitButton = ({ boardIndex, todoInput }) => {
    const handleSubmit = () => {
      setLocalBoards(prevState => {
        const nextLocalBoards = [...prevState];
        const board = nextLocalBoards[boardIndex];

        board.items = [...board.items, { content: todoInput }]

        updateLocalStorage("todos", localBoards);

        return nextLocalBoards;
      })
    }

    return <button className="submit" onClick={handleSubmit}>Submit</button>
  };

  const Board = ({ title, titleColor, boardIndex, children }) => {
    const [todoInput, setTodoInput] = React.useState("");

    const handleTodoInputChange = e => {
      setTodoInput(e.target.value)
    }

    return (
      <div className="todoList">
        <p style={{ backgroundColor: titleColor }}>{title}</p>
        <div className="todo-items">
          {children}
        </div>
        <div className="add">
          <TodoInput handleTodoInputChange={handleTodoInputChange} />
          <SubmitButton todoInput={todoInput} boardIndex={boardIndex} />
        </div>
      </div>
    )
  };
  const Todo = ({ content, todoIndex, boardIndex }) => {
    const handleMoveButtonsClick = (direction) => moveTodo(todoIndex, boardIndex, direction)

    const TodoBody = ({ children }) => {
      const allowBack = boardIndex > 0;
      const allowNext = boardIndex < boards.length - 1;

      return (
        <>
          {allowBack && <span className="back move" onClick={() => handleMoveButtonsClick("back")}>&lt;</span>}
          {children}
          {allowNext && <span className="next move" onClick={() => handleMoveButtonsClick("next")}>&gt;</span>}
        </>
      )
    }

    return (
      <div className="item" onClick={() => deleteTodo(todoIndex, boardIndex)}>
        <TodoBody>
          <p>{content}</p>
        </TodoBody>
      </div>
    )
  };

  const generateKanban = (boards) => {
    return boards.map((board, i) => {
      return (
        <Board key={i} title={board.title} titleColor={board.titleColor} boardIndex={i}>
          {
            board.items.map((item, j) => {
              return <Todo content={item.content} key={j} todoIndex={j} boardIndex={i} />
            })
          }
        </Board>
      )
    })
  }

  return (
    <div>
      <div className="board">
        {generateKanban(localBoards)}
      </div>
    </div>
  )
}

const StarsAndKanban = () => {
  const pathnames = window.location.pathname.split("/");
  const path = pathnames[pathnames.length - 1];

  if (path === "kanban") return <Kanban />;
  if (path === "stars") return <Stars />;

  return <h1>Hello Stars and Kanban!</h1>
};

ReactDOM.render(
  <StarsAndKanban />,
  document.getElementById('root')
)
