import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    boardColor: string;
    cardColor: string;
    textColor: string;
    headerColor: string;
    boxShadowColor: string;
    innerBoardColor: string;
    cardEnterColor: string;
    cardExitColor: string;
    addBtnHoverColor: string;
  }
}
