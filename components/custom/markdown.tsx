import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import BookBlock from "./book-block";
import DefinitionBlock from "./definition-block";

const createMarkdownComponents = (specialBlocks: Array<{ marker: string, Component: React.ComponentType<any> }>) => {
  return {
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

      // Check each special block type
      for (const { marker, Component } of specialBlocks) {
        const pattern = `=${marker}=(.*?)=${marker}=`;
        const match = children.match(new RegExp(pattern, 's'));

        if (match) {
          const content = match[1].trim();
          return <Component text={content} />;
        }
      }

      return <p {...props}>{children}</p>;
    },
  };
};

const specialBlocks = [
  { marker: '1', Component: DefinitionBlock },
  { marker: '2', Component: BookBlock },
];

// Create components once
const markdownComponents = createMarkdownComponents(specialBlocks);

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
