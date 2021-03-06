import { v4 } from 'uuid';
import DiseaseHistory from 'domain/entity/diseaseHistory/DiseaseHistory';
import MomentOfObservation from 'domain/entity/diseaseHistory/MomentOfObservation';
import Period from 'domain/entity/period/Period';
import randomNumber from 'helper/common/randomNumber';

// eslint-disable-next-line no-restricted-globals
const scope = (self as unknown) as Worker;

scope.onmessage = ({ data: { periods, amount } }) => {
    const diseaseHistories: DiseaseHistory[] = [];

    for (let i = 0; i < amount; i++) {
        periods.forEach((period: Period) => {
            const { values, bounds } = period;
            let lastBoundDuration = 0;
            const diseaseHistory = new DiseaseHistory(v4(), i + 1, period);

            bounds?.forEach(({ upperBound, lowerBound }, index) => {
                const { from, to } = values[index];
                const periodDuration = randomNumber(lowerBound, upperBound);
                let momentsOfObservationDurationCounter = periodDuration;
                let commonMomentsDuration = 0;

                while (momentsOfObservationDurationCounter > 0) {
                    const momentOfObservationDuration = randomNumber(
                        1,
                        momentsOfObservationDurationCounter,
                    );
                    const momentOfObservationValue = randomNumber(from, to);
                    const momentOfObservation = new MomentOfObservation(
                        lastBoundDuration + commonMomentsDuration + momentOfObservationDuration,
                        momentOfObservationValue,
                    );

                    diseaseHistory.momentsOfObservation.push(momentOfObservation);
                    momentsOfObservationDurationCounter -= momentOfObservationDuration;
                    commonMomentsDuration += momentOfObservationDuration;
                }

                lastBoundDuration += periodDuration;
            });

            diseaseHistories.push(diseaseHistory);
        });
    }

    const CHUNK_SIZE = 2_000_000;

    for (let i = 0, j = CHUNK_SIZE; i < diseaseHistories.length; i += CHUNK_SIZE, j += CHUNK_SIZE) {
        scope.postMessage({
            answer: diseaseHistories.slice(i, j),
        });
    }
};
