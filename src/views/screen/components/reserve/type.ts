export interface LegendRich {
    name: {
        fontSize: number;
        color: string;
    };
    value: {
        fontSize: number;
        color: string;
    };
    iscolor: {
        color: string;
    };
    [key: string]: {
        fontSize?: number;
        color?: string;
    };
}

