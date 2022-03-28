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
import StatisticForPeriod from '../../../../../../domain/entity/period/StatisticForPeriod';

interface Column {
    id: 'value' | 'percentEquals' | 'percentMore' | 'percentLess';
    label: string;
}

const COLUMNS: Column[] = [
    { id: 'value', label: 'Статистика для:' },
    { id: 'percentEquals', label: 'ЧПД(МБЗ)=ЧПД(ИФБЗ)' },
    { id: 'percentMore', label: 'ЧПД(МБЗ)>ЧПД(ИФБЗ)' },
    { id: 'percentLess', label: 'ЧПД(МБЗ)<ЧПД(ИФБЗ)' },
];

const PeriodTable = observer(() => {
    const { periods, indPeriods } = useService(AppController);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1000);
    const allAttributes: StatisticForPeriod[] = [];
    const periodsStatisticFromAttribute: StatisticForPeriod[] = [];
    const allDiseases: StatisticForPeriod[] = [];
    const periodsStatisticFromDisease: StatisticForPeriod[] = [];
    const colorDisease = 'rgba(134,197,245,0.62)';
    const colorAttribute = 'rgba(243,191,123,0.65)';
    const colorGeneral = 'rgba(143,255,145,0.77)';

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    periods.forEach((period, index) => {
        allDiseases.push(
            new StatisticForPeriod(
                period.id,
                period.disease.name,
                period.amount,
                indPeriods[index].amount,
            ),
        );
    });

    for (let i = 0; i < periods.length - 1; i++) {
        let countAttributes = 0;
        let correctPeriodToAttributes = 0;
        let lessPeriodToAttributes = 0;
        let morePeriodToAttributes = 0;

        if (i !== 0 && periods[i].disease === periods[i - 1].disease) {
            // eslint-disable-next-line no-continue
            continue;
        }

        for (let i1 = i; i1 < periods.length; i1++) {
            if (periods[i].disease === periods[i1].disease) {
                if (periods[i1].amount === indPeriods[i1].amount) {
                    correctPeriodToAttributes++;
                } else if (periods[i1].amount > indPeriods[i1].amount) {
                    morePeriodToAttributes++;
                } else if (periods[i1].amount < indPeriods[i1].amount) {
                    lessPeriodToAttributes++;
                }
            } else {
                break;
            }
            countAttributes++;
            if (i1 === periods.length - 1) {
                break;
            }
        }

        const percentToDisease = correctPeriodToAttributes / countAttributes;
        const percentMoreToDisease = morePeriodToAttributes / countAttributes;
        const percentLessToDisease = lessPeriodToAttributes / countAttributes;

        for (let i2 = i; i2 < periods.length; i2++) {
            if (periods[i].disease === periods[i2].disease) {
                allDiseases[i2].percentEquals = percentToDisease * 100;
                allDiseases[i2].percentMore = percentMoreToDisease * 100;
                allDiseases[i2].percentLess = percentLessToDisease * 100;
                allDiseases[i2].color = colorDisease;
            } else {
                break;
            }
        }
    }

    for (let i3 = 0; i3 < periods.length - 1; i3++) {
        if (i3 !== 0 && periods[i3].disease === periods[i3 - 1].disease) {
            // eslint-disable-next-line no-continue
            continue;
        }
        periodsStatisticFromDisease.push(allDiseases[i3]);
    }

    periods.forEach((period, index) => {
        allAttributes.push(
            new StatisticForPeriod(
                period.id,
                period.attribute.name,
                period.amount,
                indPeriods[index].amount,
            ),
        );
    });

    for (let j = 0; j < periods.length - 1; j++) {
        let countDisease = 0;
        let correctPeriodToDisease = 0;
        let lessPeriodToDisease = 0;
        let morePeriodToDisease = 0;

        if (j !== 0 && periods[j].attribute === periods[0].attribute) {
            // eslint-disable-next-line no-continue
            break;
        }

        for (let j1 = j; j1 < periods.length; j1++) {
            if (periods[j].attribute === periods[j1].attribute) {
                if (periods[j1].amount === indPeriods[j1].amount) {
                    correctPeriodToDisease++;
                } else if (periods[j1].amount > indPeriods[j1].amount) {
                    morePeriodToDisease++;
                } else if (periods[j1].amount < indPeriods[j1].amount) {
                    lessPeriodToDisease++;
                }
                countDisease++;
            }

            if (j1 === periods.length - 1) {
                break;
            }
        }

        const percentToAttribute = correctPeriodToDisease / countDisease;
        const percentMoreToAttribute = morePeriodToDisease / countDisease;
        const percentLessToAttribute = lessPeriodToDisease / countDisease;

        for (let j2 = j; j2 < periods.length; j2++) {
            if (periods[j].attribute === periods[j2].attribute) {
                allAttributes[j2].percentEquals = percentToAttribute * 100;
                allAttributes[j2].percentMore = percentMoreToAttribute * 100;
                allAttributes[j2].percentLess = percentLessToAttribute * 100;
                allAttributes[j2].color = colorAttribute;
            }
        }
    }

    let generalPercent = 0;
    let generalMorePercent = 0;
    let generalLessPercent = 0;
    let count = 0;

    for (let j3 = 0; j3 < periods.length - 1; j3++) {
        if (j3 !== 0 && periods[j3].attribute === periods[0].attribute) {
            // eslint-disable-next-line no-continue
            break;
        }
        generalPercent += allAttributes[j3].percentEquals;
        generalMorePercent += allAttributes[j3].percentMore;
        generalLessPercent += allAttributes[j3].percentLess;
        count++;
    }

    generalPercent /= count;
    generalMorePercent /= count;
    generalLessPercent /= count;

    for (let j4 = 0; j4 < periods.length - 1; j4++) {
        if (j4 !== 0 && periods[j4].attribute === periods[0].attribute) {
            // eslint-disable-next-line no-continue
            break;
        }
        periodsStatisticFromAttribute.push(allAttributes[j4]);
    }

    periodsStatisticFromAttribute.unshift(
        new StatisticForPeriod(
            '0',
            'Всех записей',
            0,
            0,
            colorGeneral,
            generalPercent,
            generalMorePercent,
            generalLessPercent,
        ),
    );

    const periodsStatisticFromAllValue = periodsStatisticFromAttribute.concat(
        periodsStatisticFromDisease,
    );

    return (
        <Paper>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {COLUMNS.map(({ id, label }) => (
                                <TableCell key={id}>{label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {periodsStatisticFromAllValue
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((period) => (
                                <Row key={period.id} period={period} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={periods.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
});

export default PeriodTable;
