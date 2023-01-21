import { atom, selector } from "recoil";

export interface ITodo {
  id:number;
  text:string;
}
interface ITodoState {
  [key: string]: ITodo[];
}
/*export const minuteState = atom({
  key: "minutes",
  default: 0,
});

export const hourSelector = selector <number>({
  key: "hours",
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }, newValue ) => {
    const minutes = Number(newValue) * 60;
    set(minuteState, minutes);
  }
}); */
export const toDoState = atom<ITodoState>({
  key: "toDos",
  default: {
    to_do: [],
    doing: [],
    done: [],
  }
}) 
