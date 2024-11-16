import styled, { ThemeProvider } from "styled-components";
import "GlobalStyle.css";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { toDoState, isDarkAtom } from "./atoms";
import Swal from "sweetalert2";
import { lightTheme, darkTheme } from "./theme";

const sweetAPI = "//api.ipify.org?format=json";

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
  left: 93vw;
  background-color: transparent;
  border: none;
`;

function App() {
  const [toDos, settoDos] = useRecoilState(toDoState);
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const onAddBoard = () => {
    const inputValue = fetch(sweetAPI)
      .then((response) => response.json())
      .then((data) => data.name);

    (async () => {
      const { value: getName } = await Swal.fire({
        title: "보드 이름을 입력해주세요.",
        input: "text",
        inputPlaceholder: "이름을 입력해주세요.",
      });

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

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <ToggleBtn onClick={toggleDarkAtom}>{isDark ? "🌙" : "☀️"}</ToggleBtn>
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <ButtonBoard onClick={onAddBoard}>Add Board</ButtonBoard>
            <Header>Trello</Header>
          </DragDropContext>
        </>
      </ThemeProvider>
    </>
  );
}

export default App;
