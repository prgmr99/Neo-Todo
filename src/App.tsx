import styled from "styled-components";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import Board from "./components/Board";
//import Trash from "./components/Trash";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const Boards = styled.div`
  display: flex;
`;
const Area = styled.div`
  position: relative;
  top: 370px;
  left: 100px;
  font-size: 50px;
`;
const ButtonBoard = styled.button`
  font-size: 20px;
  top: 0px;
  left: 0px;
  position: relative;
`;
function App() {
  const [toDos, settoDos] = useRecoilState(toDoState);
  const onAddBoard = () => {
    const name = window.prompt("새 보드 이름을 입력해주세요!")?.trim();
    if (name !== null && name !== undefined) {
      if (name === "") {
        alert("이름을 입력해주세요!");
        return;
      }
      settoDos((prev) => {
        return [...prev, { title: name, id: Date.now(), toDos: [] }];
      });
    }
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
    <DragDropContext onDragEnd={onDragEnd}>
      <ButtonBoard onClick={onAddBoard}>+</ButtonBoard>
      <Wrapper>
        <Droppable droppableId="boards" direction="horizontal" type="BOARDS">
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
            <Area>
              <div ref={provided.innerRef} {...provided.droppableProps}>
                🗑
              </div>
              {provided.placeholder}
            </Area>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
