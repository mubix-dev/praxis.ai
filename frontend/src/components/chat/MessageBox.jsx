import React, { useState } from 'react'
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useDispatch } from 'react-redux'
import { setOpenArtifact } from '../../redux/messageSlice'
import { X, Copy, Check, Code2, ChevronRight } from 'lucide-react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 text-[11px] text-slate-500">
        <span>{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white cursor-pointer">
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        wrapLongLines
        showLineNumbers
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, fontSize: "12px", background: "#0a0c10" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const mdComponents = {
  p: (props) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="text-cyan-400 hover:underline break-all"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  h1: (props) => <h1 className="text-lg font-semibold text-slate-100 mt-3 mb-2" {...props} />,
  h2: (props) => <h2 className="text-base font-semibold text-slate-100 mt-3 mb-2" {...props} />,
  h3: (props) => <h3 className="text-sm font-semibold text-slate-100 mt-2 mb-1" {...props} />,
  ul: (props) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-slate-100" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-indigo-400/50 pl-3 my-2 text-slate-400 italic" {...props} />
  ),
  pre: ({ children }) => children,
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "")
    return match ? (
      <CodeBlock language={match[1]} code={String(children).replace(/\n$/, "")} />
    ) : (
      <code className="bg-white/10 rounded px-1.5 py-0.5 text-[12px] text-cyan-300" {...props}>{children}</code>
    )
  },
  table: (props) => (
    <div className="overflow-x-auto my-2">
      <table className="text-xs border-collapse" {...props} />
    </div>
  ),
  th: (props) => <th className="border border-white/10 px-2 py-1 bg-white/5 text-left font-medium" {...props} />,
  td: (props) => <td className="border border-white/10 px-2 py-1" {...props} />,
  hr: () => <hr className="border-white/10 my-3" />,
}

function MessageBox({ message }) {
  const isUser = message.role === "user"
  const [preview, setPreview] = useState(null)
  const dispatch = useDispatch()

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2.5 text-sm wrap-break-word ${
          isUser
            ? "max-w-[80%] md:max-w-[70%] rounded-2xl rounded-br-sm bg-indigo-500/25 text-indigo-100 whitespace-pre-wrap"
            : "w-full text-slate-300"
        }`}
      >
        {message.images?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.images.map((img,i) => (
                <img
                  key={i}
                  src={img}
                  alt="search result"
                  loading='lazy'
                  onError={(e) => e.currentTarget.remove()}
                  onClick={() => setPreview(img)}
                  className="w-32 h-24 object-cover rounded-lg border border-white/10 hover:opacity-80 cursor-pointer"
                />
            ))}
          </div>
        )}
        {isUser ? (
          message.content
        ) : (
          <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {message.content}
          </Markdown>
        )}

        {/* artifact card — click to open the panel */}
        {message.artifact && (
          <button
            onClick={() => dispatch(setOpenArtifact(message.artifact))}
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/10 hover:border-indigo-400/40 hover:bg-white/5 text-left cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
              <Code2 size={16} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 truncate">{message.artifact.title}</p>
              <p className="text-xs text-slate-500">Click to view code & preview</p>
            </div>
            <ChevronRight size={16} className="text-slate-500 shrink-0" />
          </button>
        )}
      </div>

      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X size={20} />
          </button>
          <img
            src={preview}
            alt="preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  )
}

// memo: a message's content never changes after render — skip re-rendering
// unchanged bubbles when thinking/loading/other messages update
export default React.memo(MessageBox)
