import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaTasks } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [
    {
        id: 1,
        text: 'Stats',
        path: '/',
        icon: <IoBarChartSharp />
    },
    {
        id: 2,
        text: 'All tasks',
        path: '/all-tasks',
        icon: <MdQueryStats />
    },
    {
        id: 3,
        text: 'Add task',
        path: '/add-task',
        icon: <FaTasks />
    },
    {
        id: 4,
        text: 'Profile',
        path: '/profile',
        icon: <ImProfile />
    }
]

export default links;
