const Button = ({btnName, classStyles, handeClick}) =>(
    <button
            type="button"
            className={`bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 hover:from-indigo-800 hover:via-sky-800 hover:to-emerald-800 dark:hover:from-indigo-300 dark:hover:via-sky-300 dark:hover:to-emerald-300 text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-gray-100 dark:text-nft-black-1 active:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300  ${classStyles}`}
            onClick={handeClick}
    >
        {btnName}
    </button>
)

export default Button;
