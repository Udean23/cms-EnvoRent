import { FaSliders } from "react-icons/fa6";

const Filter = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex cursor-pointer items-center gap-2 border px-4 py-2 rounded-lg text-sm text-blue-600 border-blue-600 hover:bg-blue-200 transition"
  >
    <FaSliders size={20} />
  </button>
);
export default Filter;