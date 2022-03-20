import { FC } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import StatisticForPeriod from '../../../../../../../domain/entity/period/StatisticForPeriod';

type PropsT = {
    period: StatisticForPeriod;
};

const Row: FC<PropsT> = (props) => {
    const { period } = props;
    const { value, percent, color } = period;

    return (
        <TableRow>
            <TableCell style={{ backgroundColor: color }}>{value}</TableCell>
            <TableCell style={{ backgroundColor: color }}>{percent}%</TableCell>
        </TableRow>
    );
};

export default Row;
