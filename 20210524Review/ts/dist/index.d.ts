interface ITemp {
    readonly name: string;
    readonly age?: number;
    readonly [propName: string]: string | number;
}
declare const temp: ITemp;
