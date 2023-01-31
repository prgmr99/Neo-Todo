import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}
interface ITodoState {
  [key: string]: ITodo[];
}
export interface IBoard {
  id: number;
  text: string;
  toDos: ITodo[];
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

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const toDoState = atom<ITodoState>({
  key: "toDos",
  default: {
    "할 일": [],
    "하는 중": [],
    "다 했다!": [],
  },
  effects: [localStorageEffect("toDos")],
});
