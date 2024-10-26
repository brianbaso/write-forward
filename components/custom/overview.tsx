import { motion } from "framer-motion";
import Link from "next/link";

import { LogoOpenAI, MessageIcon, VercelIcon } from "./icons";
import { RiMentalHealthLine } from "react-icons/ri";


export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[500px] mt-20 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <RiMentalHealthLine size={21} />
          <span>+</span>
          <MessageIcon />
        </p>
        <p>
          This chat specializes in helping you understand and find peace with an emotional challenge by asking thoughtful, step-by-step questions.
        </p>
        <p>
          It provides a supportive, conversational approach to help you reflect deeply on what’s troubling you, encouraging a gradual path to acceptance and clarity. Shall we begin?
        </p>
      </div>
    </motion.div >
  );
};
