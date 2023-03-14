import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Draggable } from "react-beautiful-dnd";
import { toDoState, ITodo } from "../atoms";
import DelBtn from "./DelBtn";
import Specific from "./Specific";

interface IDraggableCardProps {
  toDoId: number;
  toDo: ITodo;
  index: number;
  boardId: number;
}
interface ICard {
  isDragging: boolean;
  boardId: string;
}

const Card = styled.div<ICard>`
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
  color: ${(props) => props.theme.textColor};
  align-items: center;
  word-break: break-all;
`;

function DraggableCard({ toDoId, toDo, index, boardId }: IDraggableCardProps) {
  const setTodos = useSetRecoilState(toDoState);
  return (
    <div>
      <Draggable key={toDoId} draggableId={"todo-" + toDo.id} index={index}>
        {(provided, snapshot) => (
          <Card
            isDragging={snapshot.isDragging}
            boardId={boardId + ""}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <DelBtn index={index} toDoId={toDoId} boardId={boardId} />
            {toDo.text}
          </Card>
        )}
      </Draggable>
    </div>
  );
}

export default React.memo(DraggableCard);
