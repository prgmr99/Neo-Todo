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
import { Helmet } from "react-helmet-async";

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
  font-size: 100px;
  text-align: left;
  margin-left: 200px;
  margin-top: 20px;
  height: 120px;
  width: 100%;
  padding-left: 20px;
  background-color: #2cd9d975;
  box-shadow: 4px 4px 8px #888888;
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
      <ButtonBoard onClick={onAddBoard}>Add Board</ButtonBoard>
      <Header>Trello</Header>
      <Helmet>
        <title>Trello</title>
      </Helmet>
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
  );
}

export default App;
