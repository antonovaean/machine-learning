export default class StatisticForPeriod {
    constructor(
        public readonly id: string,
        public readonly value: string,
        public readonly periodMBZ: number,
        public readonly periodIFBZ: number,
        public color: string = '',
        public percent: number = 0,
    ) {}
}
