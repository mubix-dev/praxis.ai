import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Eye, X, Copy, Check, ExternalLink } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { setOpenArtifact } from '../redux/messageSlice'

function Artifact() {
  const { openArtifact: artifact } = useSelector((state) => state.message)
  const dispatch = useDispatch()

  const [view, setView] = useState('preview')
  const [fileIndex, setFileIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (artifact) {
      setFileIndex(0)
      setView(artifact.preview ? 'preview' : 'code')
    }
  }, [artifact])

  const file = artifact?.files?.[fileIndex]

  const handleCopy = () => {
    navigator.clipboard.writeText(file?.content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const openFullPreview = () => {
    const blob = new Blob([artifact.preview], { type: 'text/html' })
    window.open(URL.createObjectURL(blob), '_blank')
  }

  return (
      <AnimatePresence>
        {artifact && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-0 z-40 lg:static lg:z-auto w-full lg:w-[45%] h-full shrink-0 flex flex-col bg-[#0d0f14] border-l border-white/8"
          >
            {/* header */}
            <div className="h-14 shrink-0 px-4 flex items-center gap-3 border-b border-white/8">
              <Code2 size={15} className="text-indigo-400 shrink-0" />
              <p className="text-sm font-medium truncate flex-1">{artifact.title}</p>

              {/* code / preview toggle */}
              <div className="flex items-center rounded-lg bg-white/5 border border-white/8 p-0.5">
                {['code', 'preview'].map((v) => (
                  <button key={v} onClick={() => setView(v)} className="relative px-3 py-1 text-xs capitalize cursor-pointer">
                    {view === v && (
                      <motion.div layoutId="artifact-view" className="absolute inset-0 rounded-md bg-indigo-500/25" />
                    )}
                    <span className={`relative flex items-center gap-1 ${view === v ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {v === 'code' ? <Code2 size={12} /> : <Eye size={12} />} {v}
                    </span>
                  </button>
                ))}
              </div>

              {artifact.preview && (
                <button
                  onClick={openFullPreview}
                  title="Open preview in new tab"
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 cursor-pointer"
                >
                  <ExternalLink size={15} />
                </button>
              )}

              <button onClick={() => dispatch(setOpenArtifact(null))} className="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* body */}
            <AnimatePresence mode="wait">
              {view === 'code' ? (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* file tabs */}
                  <div className="flex items-center px-3 border-b border-white/8 overflow-x-auto no-scrollbar shrink-0">
                    {artifact.files?.map((f, i) => (
                      <button
                        key={f.path}
                        onClick={() => setFileIndex(i)}
                        className={`relative px-3 py-2.5 text-xs whitespace-nowrap cursor-pointer ${
                          i === fileIndex ? 'text-indigo-200' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {f.path}
                        {i === fileIndex && (
                          <motion.div layoutId="artifact-file" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
                        )}
                      </button>
                    ))}

                    <button
                      onClick={handleCopy}
                      className="ml-auto flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-white cursor-pointer shrink-0"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* code */}
                  <div className="flex-1 overflow-auto">
                    <SyntaxHighlighter
                      language={file?.language}
                      style={oneDark}
                      showLineNumbers
                      wrapLongLines
                      customStyle={{ margin: 0, minHeight: '100%', fontSize: '12px', background: '#0a0c10' }}
                    >
                      {file?.content || ''}
                    </SyntaxHighlighter>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex-1 min-h-0 ${artifact.preview ? 'bg-white' : ''}`}
                >
                  {artifact.preview ? (
                    <iframe
                      srcDoc={artifact.preview}
                      title="preview"
                      sandbox="allow-scripts"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                      <Eye size={22} className="text-slate-600" />
                      <p className="text-sm text-slate-400">No preview available</p>
                      <p className="text-xs text-slate-600">
                        This stack can't run in the browser directly — check the Code tab instead.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
  )
}

export default Artifact
