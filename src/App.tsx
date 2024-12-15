import { ThemeProvider } from "styled-components";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { toDoState, isDarkAtom } from "./atoms";
import { lightTheme, darkTheme } from "./theme";
import { GlobalStyle } from "./GlobalStyle.style";

import Wrapper from "./components/Wrapper";
import ToggleButton from "./components/ToggleButton";

function App() {
  const isDark = useRecoilValue(isDarkAtom);
  const setToDo = useSetRecoilState(toDoState);

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
        <ToggleButton />
        <DragDropContext onDragEnd={onDragEnd}>
          <Wrapper />
        </DragDropContext>
      </ThemeProvider>
    </>
  );
}

export default App;
