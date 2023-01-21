import React from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import DraggableCard from "./components/DraggableCard";
import Board from './components/Board';

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
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
`;



function App() {
  const [toDos, settoDos] = useRecoilState(toDoState);
  const onDragEnd = (info:DropResult) => {
    const {destination, source, draggableId} = info;
    if(!destination) return;
    if(destination?.droppableId === source.droppableId) {
      //same board movement
      settoDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        // 1) Delete item on source.index
        boardCopy.splice(source.index, 1)
        // 2) Put back the item on the destination.index
        boardCopy.splice(destination?.index, 0, taskObj)
        return {
          ...allBoards,
          [source.droppableId]:boardCopy
        };
      })
    }
    if(destination?.droppableId !== source.droppableId) {
      // cross board movement
      settoDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj)
        return {
          ...allBoards,
           [source.droppableId]:sourceBoard,
           [destination.droppableId]:destinationBoard
        }
      })
    }
  }
    /* settoDos((oldTodos) => {
      const newTodos = [...oldTodos];
      // 1) Delete item on source.index
      newTodos.splice(source.index, 1)
      // 2) Put back the item on the destination.index
      newTodos.splice(destination?.index, 0, draggableId)
      return newTodos;
    }) */
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]}/>)}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );

}

export default App;