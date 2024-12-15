import React from "react";
import Swal from "sweetalert2";
import styled from "styled-components";

import { useSetRecoilState } from "recoil";
import { toDoState } from "../../atoms";

const BoardButton = styled.button`
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

const AddBoardButton = () => {
  const setToDo = useSetRecoilState(toDoState);

  const onAddBoard = () => {
    (async () => {
      const { value: getName } = await Swal.fire({
        title: "보드 이름을 입력해주세요.",
        input: "text",
        inputPlaceholder: "이름을 입력해주세요.",
      });

      if (getName) {
        Swal.fire("생성 완료!");
      }
      if (getName === "") {
        return;
      }
      setToDo((prev) => {
        return [...prev, { title: getName, id: Date.now(), toDos: [] }];
      });
    })();
  };

  return <BoardButton onClick={onAddBoard}>Add Board</BoardButton>;
};

export default AddBoardButton;
