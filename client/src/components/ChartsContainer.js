import React, {useState} from 'react'
import Wrapper from '../assets/wrappers/ChartsContainer'
import CustomAreaChart from './CustomAreaChart'
import CustomBarChart from './CustomBarChart'
import { useAppContext } from '../context/appContext'

const ChartsContainer = () => {
    const [barChart, setBarChart] = useState(true);
    const {monthlyTasks:data} = useAppContext()

    return (
        <Wrapper>
            <h4>monthly tasks</h4>
            <button type='button' onClick={() => setBarChart(!barChart)}>{barChart? 'Area chart':'bar chart'}</button>
            { barChart? <CustomBarChart data={data} /> : <CustomAreaChart data={data} /> }
        </Wrapper>
    )
}

export default ChartsContainer