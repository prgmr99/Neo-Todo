import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import DelBtn from "./DelBtn";

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
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

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <DelBtn index={index} toDoId={toDoId} boardId={boardId}></DelBtn>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
