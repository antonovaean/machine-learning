import { FC } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import StatisticForPeriod from '../../../../../../../domain/entity/period/StatisticForPeriod';

type PropsT = {
    period: StatisticForPeriod;
};

const Row: FC<PropsT> = (props) => {
    const { period } = props;
    const { value, percentEquals, color, percentMore, percentLess } = period;

    return (
        <TableRow>
            <TableCell style={{ backgroundColor: color }}>{value}</TableCell>
            <TableCell style={{ backgroundColor: color }}>{percentEquals}%</TableCell>
            <TableCell style={{ backgroundColor: color }}>{percentMore}%</TableCell>
            <TableCell style={{ backgroundColor: color }}>{percentLess}%</TableCell>
        </TableRow>
    );
};

export default Row;
