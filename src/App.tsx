import styled, { ThemeProvider } from "styled-components";
import Swal from "sweetalert2";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { toDoState, isDarkAtom } from "./atoms";
import { lightTheme, darkTheme } from "./theme";
import Wrapper from "./components/Wrapper";
import { GlobalStyle } from "./GlobalStyle.style";

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
  const isDark = useRecoilValue(isDarkAtom);
  const setToDo = useSetRecoilState(toDoState);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const onAddBoard = () => {
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
      setToDo((prev) => {
        return [...prev, { title: getName, id: Date.now(), toDos: [] }];
      });
    })();
  };

  const handleBoardReorder = (
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setToDo((prev) => {
      const toDosCopy = [...prev];
      const [movedBoard] = toDosCopy.splice(sourceIndex, 1);
      toDosCopy.splice(destinationIndex, 0, movedBoard);
      return toDosCopy;
    });
  };

  const handleToDoReorderWithinBoard = (
    sourceIndex: number,
    destinationIndex: number,
    boardId: string
  ) => {
    setToDo((prev) => {
      const toDosCopy = [...prev];
      const boardIndex = toDosCopy.findIndex(
        (board) => board.id + "" === boardId
      );
      const boardCopy = { ...toDosCopy[boardIndex] };
      const [movedToDo] = boardCopy.toDos.splice(sourceIndex, 1);
      boardCopy.toDos.splice(destinationIndex, 0, movedToDo);
      toDosCopy[boardIndex] = boardCopy;
      return toDosCopy;
    });
  };

  const handleToDoMoveToAnotherBoard = (
    sourceIndex: number,
    destinationIndex: number,
    sourceBoardId: string,
    destinationBoardId: string
  ) => {
    setToDo((prev) => {
      const toDosCopy = [...prev];
      const sourceBoardIndex = toDosCopy.findIndex(
        (board) => board.id + "" === sourceBoardId
      );
      const destinationBoardIndex = toDosCopy.findIndex(
        (board) => board.id + "" === destinationBoardId
      );

      const sourceBoardCopy = { ...toDosCopy[sourceBoardIndex] };
      const destinationBoardCopy = { ...toDosCopy[destinationBoardIndex] };

      const [movedToDo] = sourceBoardCopy.toDos.splice(sourceIndex, 1);
      destinationBoardCopy.toDos.splice(destinationIndex, 0, movedToDo);

      toDosCopy[sourceBoardIndex] = sourceBoardCopy;
      toDosCopy[destinationBoardIndex] = destinationBoardCopy;

      return toDosCopy;
    });
  };

  const handleToDoDelete = (sourceIndex: number, boardId: string) => {
    setToDo((prev) => {
      const toDosCopy = [...prev];
      const boardIndex = toDosCopy.findIndex(
        (board) => board.id + "" === boardId
      );
      const boardCopy = { ...toDosCopy[boardIndex] };
      boardCopy.toDos.splice(sourceIndex, 1);
      toDosCopy[boardIndex] = boardCopy;
      return toDosCopy;
    });
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;

    if (!destination) return;

    const isSameBoard = source.droppableId === destination.droppableId;

    if (source.droppableId === "boards") {
      if (source.index !== destination.index) {
        handleBoardReorder(source.index, destination.index);
      }
    } else if (destination.droppableId === "trash") {
      handleToDoDelete(source.index, source.droppableId.split("-")[1]);
    } else if (isSameBoard) {
      if (source.index !== destination.index) {
        handleToDoReorderWithinBoard(
          source.index,
          destination.index,
          source.droppableId.split("-")[1]
        );
      }
    } else {
      handleToDoMoveToAnotherBoard(
        source.index,
        destination.index,
        source.droppableId.split("-")[1],
        destination.droppableId.split("-")[1]
      );
    }
  };

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <ToggleBtn onClick={toggleDarkAtom}>{isDark ? "🌙" : "☀️"}</ToggleBtn>
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <ButtonBoard onClick={onAddBoard}>Add Board</ButtonBoard>
            <Header>Trello</Header>
            <Wrapper />
          </DragDropContext>
        </>
      </ThemeProvider>
    </>
  );
}

export default App;
