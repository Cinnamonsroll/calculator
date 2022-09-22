import { motion } from "framer-motion"

interface KeyProps {
    text: string,
    type: "light" | "dark" | "normal",
    onClick: any;
    input?: any;
}

const Key = ({ text, type, onClick }: KeyProps) => {
    return <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.2 }}
        onClick={onClick}
        className={`${text === "AC" ? "special-button" : ""} calculator-key p-3 rounded-lg flex justify-center items-center ${type} key hover:cursor-pointer`} >
        {text}
    </motion.div>
}
export default Key