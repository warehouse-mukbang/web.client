interface IBase {
  size: 'small' | 'large';
}

const Base: React.FC<IBase> = ({ children, size }) => {
  return (
    <li
      className={`bg-white dark:bg-gray-800 rounded-lg shadow min-h-[400px] h-full max-h-[400px] w-full p-4 flex flex-col col-span-2 ${
        size === 'small' ? 'md:col-span-1' : ''
      }`}
    >
      {children}
    </li>
  );
};

interface IHeader {
  title: string;
  subtitle?: string | number;
}
const Header: React.FC<IHeader> = ({ title, subtitle }) => {
  return (
    <p className='text-lg border-b dark:border-gray-500 pb-4 text-gray-600 dark:text-gray-200'>
      {title}
      <span className='ml-1 text-blue-400 font-bold'>{subtitle}</span>
    </p>
  );
};

export { Base, Header };
