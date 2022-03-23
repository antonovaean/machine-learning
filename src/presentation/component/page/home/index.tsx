import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useService } from 'presentation/context/Container';
import Step from 'domain/entity/app/Step';
import AppController from 'presentation/controller/app/AppController';
import Layout from 'presentation/component/layout/Main';
import Loader from 'presentation/component/common/block/Loader';
import DiseaseHistoriesForm from './DiseaseHistoriesForm';
import Form from './Form';
import Tables from './Tables';
import TablesStatistic from './TablesStatistic';
import DiseaseHistoriesTable from './DiseaseHistoriesTable';
import IndKnowledgeGenerationButton from './IndKnowledgeGenerationButton';

const HomePage = observer(() => {
    const {
        step,
        setInputDataStep,
        setSampleGenerationStep,
        setShowTablesStep,
        setShowDiseaseHistoriesStep,
        setIndKnowledgeBaseGenerationStep,
        setIndKnowledgeBaseStep,
        setShowTablesStatisticStep,
        periods,
        hasHistories,
        hasIndPeriods,
    } = useService(AppController);
    const [value, setValue] = useState<number>(0);
    const hasPeriods = periods.length > 0;

    const handleChange = (newValue: number) => {
        setValue(newValue);

        if (newValue) {
            if (newValue === 1) {
                if (hasHistories) {
                    setShowDiseaseHistoriesStep();
                } else {
                    setSampleGenerationStep();
                }
            }

            if (newValue === 2) {
                if (hasIndPeriods) {
                    setIndKnowledgeBaseStep();
                } else {
                    setIndKnowledgeBaseGenerationStep();
                }
            }

            if (newValue === 3) {
                if (hasIndPeriods) {
                    setShowTablesStatisticStep();
                } else {
                    setShowTablesStatisticStep();
                }
            }
        } else if (hasPeriods) {
            setShowTablesStep();
        } else {
            setInputDataStep();
        }
    };

    return (
        <Layout>
            <Tabs
                value={value}
                onChange={(_, selectedValue) => handleChange(selectedValue)}
                indicatorColor="primary"
            >
                <Tab label="Модельная база знаний" />
                <Tab label="Список историй болезней" disabled={!hasPeriods} />
                <Tab label="Восстановленная база знаний" disabled={!hasHistories} />
                <Tab label="Статистика работы программы" disabled={!hasHistories} />
            </Tabs>
            {step === Step.InputData && <Form />}
            {step === Step.SampleGeneration && <DiseaseHistoriesForm />}
            {step === Step.ShowTables && <Tables />}
            {step === Step.IndKnowledgeBase && <Tables />}
            {step === Step.ShowDiseaseHistories && <DiseaseHistoriesTable />}
            {step === Step.LoadState && <Loader />}
            {step === Step.IndKnowledgeBaseGeneration && <IndKnowledgeGenerationButton />}
            {step === Step.ShowTablesStatistic && <TablesStatistic />}
        </Layout>
    );
});

export default HomePage;
