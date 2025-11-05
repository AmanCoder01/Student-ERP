import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggleButton = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-full bg-rose-500 dark:bg-rose-700 text-gray-800 dark:text-gray-200 cursor-pointer shadow-2xl shadow-rose-300"
        >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
    );
};

export default ThemeToggleButton;