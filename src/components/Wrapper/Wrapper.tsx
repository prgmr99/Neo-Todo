import styled from "styled-components";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { toDoState } from "../../atoms";

import Board from "../Board/Board";
import Title from "../Title";

const AppWrapper = styled.section`
  height: 76vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 1200px;
  min-width: 360px;
  margin-top: 120px;
`;

const SWrapper = styled.div`
  margin: 0 auto;
`;

const Boards = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
`;

const Wrapper = () => {
  const toDos = useRecoilValue(toDoState);

  return (
    <AppWrapper>
      <Title />
      <SWrapper>
        <Droppable droppableId="boards" direction="horizontal" type="BOARDS">
          {(provided) => (
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
    </AppWrapper>
  );
};

export default Wrapper;
