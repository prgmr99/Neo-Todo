import React from "react";
import styled from "styled-components";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { toDoState } from "../atoms";

import Board from "./Board";

const SWrapper = styled.div`
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

const Wrapper = () => {
  const toDos = useRecoilValue(toDoState);

  return (
    <SWrapper>
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
    </SWrapper>
  );
};

export default Wrapper;
