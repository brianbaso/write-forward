import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import DefinitionBlock from "./definition-block";
import BookBlock from "./book-block";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    p: ({ node, children, ...props }: any) => {
      if (typeof children !== 'string') {
        return <p {...props}>{children}</p>;
      }

      // Define our special blocks with their markers and components
      const specialBlocks = [
        { marker: '1', Component: DefinitionBlock },
        { marker: '2', Component: BookBlock },
      ];

      // Check each special block type
      for (const { marker, Component } of specialBlocks) {
        const pattern = `=${marker}=(.*?)=${marker}=`;
        const match = children.match(new RegExp(pattern, 's'));

        if (match) {
          const content = match[1].trim();
          return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg my-4 shadow-sm">
              <Component text={content} />
            </div>
          );
        }
      }

      // If no special blocks found, render as normal paragraph
      return <p {...props}>{children}</p>;
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
