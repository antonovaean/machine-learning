import { useState, ChangeEvent } from 'react';
import { observer } from 'mobx-react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { useService } from 'presentation/context/Container';
import AppController from 'presentation/controller/app/AppController';
import Row from './Row';
import StatisticForZDP from '../../../../../../domain/entity/period/StatisticForZDP';
import ValueWithColor from '../../../../../../domain/entity/attribute/ValueWithColor';

const PeriodTable = observer(() => {
    const { periods, indPeriods } = useService(AppController);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1000);
    const periodsForTable = periods;
    const indPeriodsForTable = indPeriods;
    const statisticsZDP: StatisticForZDP[] = [];
    const red = 'rgba(201,20,7,0.84)';
    const green = 'rgba(143,255,145,0.94)';
    const blue = 'rgba(134,197,245,0.96)';
    const yellow = 'rgba(243,191,123,0.65)';
    const white = '#ffffff';

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    periodsForTable.forEach((period, index) => {
        const { amount } = period;
        const amountInd = indPeriodsForTable[index].amount;

        const valuesIFBZ = indPeriodsForTable[index].values;
        const valuesMBZ = period.values;
        const valuesWithColorIFBZ: ValueWithColor[] = [];
        const valuesWithColorMBZ: ValueWithColor[] = [];

        for (let d = 0; d <= valuesIFBZ.length - 1; d++) {
            valuesWithColorIFBZ.push(new ValueWithColor(valuesIFBZ[d], white));
            valuesWithColorMBZ.push(new ValueWithColor(valuesMBZ[d], white));
        }

        if (amount === amountInd) {
            const p = new StatisticForZDP(
                period.id,
                period.disease,
                period.attribute,
                valuesWithColorMBZ,
                valuesWithColorIFBZ,
                white,
            );
            statisticsZDP.push(p);
        }
    });

    let countAll = 0;
    let p1All = 0;
    let p2All = 0;
    let p3All = 0;
    let p4All = 0;

    for (let i = 0; i < statisticsZDP.length; i++) {
        const ail = statisticsZDP[i].disease;
        let count = 0;
        let p1 = 0;
        let p2 = 0;
        let p3 = 0;
        let p4 = 0;
        if (i !== 0 && ail === statisticsZDP[i - 1].disease) {
            // eslint-disable-next-line no-continue
            continue;
        }
        for (let j = i; j < statisticsZDP.length; j++) {
            if (ail === statisticsZDP[j].disease) {
                const IFBZvalues = statisticsZDP[j].valuesIFBZWithColor;
                const MBZvalues = statisticsZDP[j].valuesMBZWithColor;

                // eslint-disable-next-line @typescript-eslint/no-loop-func
                IFBZvalues.forEach((valueN, index) => {
                    count++;
                    const valueIFBZ = valueN.value;
                    const valueMBZ = MBZvalues[index].value;
                    if (valueIFBZ.from === valueMBZ.from && valueIFBZ.to === valueMBZ.to) {
                        p1++;
                        IFBZvalues[index].color = green;
                        MBZvalues[index].color = green;
                    } else if (valueIFBZ.from >= valueMBZ.from && valueIFBZ.to <= valueMBZ.to) {
                        p2++;
                        IFBZvalues[index].color = blue;
                        MBZvalues[index].color = blue;
                    } else if (valueMBZ.from >= valueIFBZ.from && valueMBZ.to <= valueIFBZ.to) {
                        p3++;
                        IFBZvalues[index].color = yellow;
                        MBZvalues[index].color = yellow;
                    } else {
                        p4++;
                        IFBZvalues[index].color = red;
                        MBZvalues[index].color = red;
                    }
                });
                if (statisticsZDP.length === 1 || j === statisticsZDP.length - 1) {
                    countAll++;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    statisticsZDP[i].p1 = ((p1 / count) * 100).toFixed(1);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    statisticsZDP[i].p2 = ((p2 / count) * 100).toFixed(1);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    statisticsZDP[i].p3 = ((p3 / count) * 100).toFixed(1);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    statisticsZDP[i].p4 = ((p4 / count) * 100).toFixed(1);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    p1All += (p1 / count) * 100;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    p2All += (p2 / count) * 100;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    p3All += (p3 / count) * 100;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    p4All += (p4 / count) * 100;
                }
            } else {
                countAll++;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                statisticsZDP[i].p1 = ((p1 / count) * 100).toFixed(1);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                statisticsZDP[i].p2 = ((p2 / count) * 100).toFixed(1);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                statisticsZDP[i].p3 = ((p3 / count) * 100).toFixed(1);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                statisticsZDP[i].p4 = ((p4 / count) * 100).toFixed(1);

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                p1All += (p1 / count) * 100;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                p2All += (p2 / count) * 100;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                p3All += (p3 / count) * 100;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                p4All += (p4 / count) * 100;
                break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    p1All = (p1All / (countAll === 0 ? 1 : countAll)).toFixed(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    p2All = (p2All / (countAll === 0 ? 1 : countAll)).toFixed(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    p3All = (p3All / (countAll === 0 ? 1 : countAll)).toFixed(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    p4All = (p4All / (countAll === 0 ? 1 : countAll)).toFixed(1);

    return (
        <Paper>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Заболевание</TableCell>
                            <TableCell>Признак</TableCell>
                            <TableCell>Номер периода</TableCell>
                            <TableCell>ЗДП(мбз)</TableCell>
                            <TableCell>ЗДП(ифбз)</TableCell>
                            <TableCell style={{ backgroundColor: green }}>
                                Полное совпадение
                            </TableCell>
                            <TableCell style={{ backgroundColor: blue }}>
                                ЗДП(ифбз) ⊂ ЗДП(мбз)
                            </TableCell>
                            <TableCell style={{ backgroundColor: yellow }}>
                                ЗДП(мбз) ⊂ ЗДП(ифбз)
                            </TableCell>
                            <TableCell style={{ backgroundColor: red }}>Остальные случаи</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statisticsZDP
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((period) => (
                                <Row key={period.id} period={period} />
                            ))}
                        <TableRow style={{ backgroundColor: '#d1ffee' }}>
                            <TableCell align="right" colSpan={5}>
                                Общая статистика по всем записям
                            </TableCell>
                            <TableCell>{p1All}</TableCell>
                            <TableCell>{p2All}</TableCell>
                            <TableCell>{p3All}</TableCell>
                            <TableCell>{p4All}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={periodsForTable.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
});

export default PeriodTable;
