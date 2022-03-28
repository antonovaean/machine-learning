export default class StatisticForPeriod {
    constructor(
        public readonly id: string,
        public readonly value: string,
        public readonly periodMBZ: number,
        public readonly periodIFBZ: number,
        public color: string = '',
        public percentEquals: number = 0,
        public percentMore: number = 0,
        public percentLess: number = 0,
    ) {}
}
