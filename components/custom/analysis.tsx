"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { Markdown } from "./markdown";
import { StreamingTextIndicator } from "./streaming-loader";

export const Analysis = ({
  title,
  content,
  isLoading,
}: {
  title: string;
  content: string | ReactNode;
  isLoading: boolean;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:px-0`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-zinc-300 text-2xl text-center font-libre-baskerville italic pb-4">
          {title}
        </h1>
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
            <StreamingTextIndicator isVisible={isLoading} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
