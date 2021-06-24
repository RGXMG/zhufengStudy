/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/6/22
 * Time: 15:04
 * $
 */
declare namespace React {
  function createDom(selector: string | HTMLElement): void
}

interface IReact {
  (): void
}

declare const ReactStatus: string


interface String {
  appendSome(): string;
}
