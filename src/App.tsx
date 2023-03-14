import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { toDoState, isDarkAtom } from "./atoms";
import Board from "./components/Board";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { lightTheme, darkTheme } from "./theme";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  line-height: 1.2;
}
a {
  text-decoration:none;
  color:inherit;
}
`;
const sweetAPI = "//api.ipify.org?format=json";
const Wrapper = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
const Boards = styled.div`
  display: flex;
`;
const Trash = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0rem;
  left: 160vh;
  width: 7.5rem;
  height: 3.75rem;
  border-radius: 0 0 100rem 100rem;
  background-color: #fdcb6e;
  box-shadow: -0.1rem 0 0.4rem rgb(210 77 77 / 15%);
  font-size: 25px;
  z-index: 5;
  transition: transform 0.3s;
  &:hover {
    margin-bottom: 0.5rem;
    color: rgba(0, 0, 0, 0.5);
    background-color: #ff7675;
    transition: background-color 0.3s ease-in-out;
  }
`;
const ButtonBoard = styled.button`
  display: block;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 20px;
  width: 140px;
  height: 45px;
  font-size: 18px;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  &:hover {
    background-color: #2ee59d;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    color: #fff;
    transform: translateY(-7px);
  }
`;
const Header = styled.h1`
  font-size: 75px;
  text-align: left;
  margin-left: 25vh;
  margin-top: 5vh;
  height: 85px;
  width: 100%;
  color: ${(props) => props.theme.textColor};
  padding-left: 20px;
  background-color: ${(props) => props.theme.headerColor};
  box-shadow: 4px 4px 8px ${(props) => props.theme.boxShadowColor};
`;
const ToggleBtn = styled.button`
  font-size: 30px;
  position: absolute;
  top: 3vh;
  left: 3vw;
  background-color: transparent;
  border: none;
`;

function App() {
  const [toDos, settoDos] = useRecoilState(toDoState);
  const onAddBoard = () => {
    /* const name = window.prompt("새 보드 이름을 입력해주세요!")?.trim();
    if (name !== null && name !== undefined) {
      if (name === "") {
        alert("이름을 입력해주세요!");
        return;
      }
      settoDos((prev) => {
        return [...prev, { title: name, id: Date.now(), toDos: [] }];
      });
    } */
    const inputValue = fetch(sweetAPI)
      .then((response) => response.json())
      .then((data) => data.name);

    (async () => {
      const { value: getName } = await Swal.fire({
        title: "보드 이름을 입력해주세요.",
        input: "text",
        inputPlaceholder: "이름을 입력해주세요.",
      });

      // 이후 처리되는 내용.
      if (getName) {
        Swal.fire("생성 완료!");
      }
      if (getName === "") {
        return;
      }
      settoDos((prev) => {
        return [...prev, { title: getName, id: Date.now(), toDos: [] }];
      });
    })();
  };
  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    if (source.droppableId === "boards") {
      if (!destination) return;
      if (source.index === destination.index) return;
      if (source.index !== destination.index) {
        settoDos((prev) => {
          const toDosCopy = [...prev];
          const prevBoard = toDosCopy[source.index];
          toDosCopy.splice(source.index, 1);
          toDosCopy.splice(destination.index, 0, prevBoard);
          return toDosCopy;
        });
      }
    } else if (source.droppableId !== "boards") {
      if (!destination) return;
      if (destination.droppableId === "trash") {
        settoDos((prev) => {
          const toDosCopy = [...prev];
          const boardIndex = toDosCopy.findIndex(
            (board) => board.id + "" === source.droppableId.split("-")[1]
          );
          const boardCopy = { ...toDosCopy[boardIndex] };
          const listCopy = [...boardCopy.toDos];
          listCopy.splice(source.index, 1);
          boardCopy.toDos = listCopy;
          toDosCopy.splice(boardIndex, 1, boardCopy);
          return toDosCopy;
        });
        return;
      }
      if (source.droppableId === destination.droppableId) {
        settoDos((prev) => {
          const toDosCopy = [...prev];
          const boardIndex = toDosCopy.findIndex(
            (board) => board.id + "" === source.droppableId.split("-")[1]
          );
          const boardCopy = { ...toDosCopy[boardIndex] };
          const listCopy = [...boardCopy.toDos];
          const prevToDo = boardCopy.toDos[source.index];
          listCopy.splice(source.index, 1);
          listCopy.splice(destination.index, 0, prevToDo);
          boardCopy.toDos = listCopy;
          toDosCopy.splice(boardIndex, 1, boardCopy);

          return toDosCopy;
        });
      }
      if (source.droppableId !== destination.droppableId) {
        settoDos((prev) => {
          const toDosCopy = [...prev];
          const sourceBoardIndex = toDosCopy.findIndex(
            (board) => board.id + "" === source.droppableId.split("-")[1]
          );
          const destinationBoardIndex = toDosCopy.findIndex(
            (board) => board.id + "" === destination.droppableId.split("-")[1]
          );
          const sourceBoardCopy = { ...toDosCopy[sourceBoardIndex] };
          const destinationBoardCopy = { ...toDosCopy[destinationBoardIndex] };
          const sourceListCopy = [...sourceBoardCopy.toDos];
          const destinationListCopy = [...destinationBoardCopy.toDos];

          const prevToDo = sourceBoardCopy.toDos[source.index];

          sourceListCopy.splice(source.index, 1);
          destinationListCopy.splice(destination.index, 0, prevToDo);

          sourceBoardCopy.toDos = sourceListCopy;
          destinationBoardCopy.toDos = destinationListCopy;

          toDosCopy.splice(sourceBoardIndex, 1, sourceBoardCopy);
          toDosCopy.splice(destinationBoardIndex, 1, destinationBoardCopy);

          return toDosCopy;
        });
      }
    }
  };
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <ToggleBtn onClick={toggleDarkAtom}>{isDark ? "🌙" : "☀️"}</ToggleBtn>
        <DragDropContext onDragEnd={onDragEnd}>
          <ButtonBoard onClick={onAddBoard}>Add Board</ButtonBoard>
          <Header>Trello</Header>
          <Helmet>
            <title>Trello</title>
          </Helmet>
          <Wrapper>
            <Droppable
              droppableId="boards"
              direction="horizontal"
              type="BOARDS"
            >
              {(provided, snapshot) => (
                <Boards ref={provided.innerRef} {...provided.droppableProps}>
                  {toDos.map((board, index) => (
                    <Draggable
                      draggableId={"board-" + board.id}
                      key={board.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Board
                          board={board}
                          parentProvided={provided}
                          isHovering={snapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Boards>
              )}
            </Droppable>
            <Droppable droppableId="trash" type="BOARD">
              {(provided, snapshot) => (
                <div>
                  <Trash ref={provided.innerRef} {...provided.droppableProps}>
                    Delete
                  </Trash>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Wrapper>
        </DragDropContext>
      </ThemeProvider>
    </>
  );
}

export default App;
