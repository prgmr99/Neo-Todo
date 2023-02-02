import React from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { Draggable } from "react-beautiful-dnd";
import { toDoState, ITodo } from "../atoms";
import DelBtn from "./DelBtn";

interface IDraggableCardProps {
  toDoId: number;
  toDo: ITodo;
  index: number;
  boardId: number;
}

const Card = styled.div<{ isDragging: boolean }>`
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: ${(props) =>
    props.isDragging ? "#fdcb6e" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging
      ? "0px 3px 5px rgba(0,0,0,1)"
      : "0px 1px 2px rgba(0,0,0,1)"};
`;
const ModBtn = styled.button`
  float: right;
`;

function DraggableCard({ toDoId, toDo, index, boardId }: IDraggableCardProps) {
  const setTodos = useSetRecoilState(toDoState);
  /* const onModTodo = () => {
    const modtoDo = window.prompt("to do를 입력해주세요!")?.trim();
    if (modtoDo !== null && modtoDo !== undefined) {
      if (modtoDo === "") {
        alert("to do를 입력해주세요!");
        return;
      }
      if (modtoDo === toDo.text) {
        alert("to do를 다시 입력해주세요!");
        return;
      }
      setTodos((prev) => {
        const boardsCopy = [...prev];
        const boardIndex = prev.findIndex((b) => b.id === boardId);
        const boardCopy = { ...boardsCopy[boardIndex] };
        const toDosCopy = [...boardCopy.toDos];
        const toDoIndex = toDosCopy.findIndex((b) => b.id === toDoId);
        console.log(toDosCopy[toDoIndex].text);
        toDosCopy[toDoIndex].text = modtoDo;
        console.log(modtoDo);
        return boardsCopy;
      });
    }
  }; */
  return (
    <Draggable key={toDoId} draggableId={"todo-" + toDo.id} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {toDo.text}
          <DelBtn index={index} toDoId={toDoId} boardId={boardId}></DelBtn>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
