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

const Card = styled.div<{ isDragging: boolean; boardId: string }>`
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 5px 5px;
  background-color: ${(props) =>
    props.boardId === "trash"
      ? "red"
      : props.isDragging
      ? "#fdcb6e"
      : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging
      ? "0px 3px 5px rgba(0,0,0,1)"
      : "0px 1px 2px rgba(0,0,0,1)"};
  font-size: 15px;
  display: flex;

  align-items: center;
  word-break: break-all;
`;

function DraggableCard({ toDoId, toDo, index, boardId }: IDraggableCardProps) {
  const setTodos = useSetRecoilState(toDoState);

  return (
    <Draggable key={toDoId} draggableId={"todo-" + toDo.id} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          boardId={boardId + ""}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <DelBtn index={index} toDoId={toDoId} boardId={boardId}></DelBtn>
          {toDo.text}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
