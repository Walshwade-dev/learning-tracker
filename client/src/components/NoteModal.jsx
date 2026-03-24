import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function NoteModal({ note, subjectConfig, onClose }) {
  if (!note) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10"
        onClick={e => e.stopPropagation()}
      >

        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: subjectConfig?.hex + '15' }}
        >
          <div className="flex items-center gap-2">
            {subjectConfig && (
              <FontAwesomeIcon
                icon={subjectConfig.icon}
                style={{ color: subjectConfig.hex }}
              />
            )}
            <span
              className="text-sm font-semibold"
              style={{ color: subjectConfig?.hex }}
            >
              {subjectConfig?.label}
            </span>
            <span className="text-gray-300 text-sm">·</span>
            <span className="text-xs text-gray-400">
              {new Date(note.createdAt).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Scrollable markdown content */}
        <div className="overflow-y-auto px-6 py-5 prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({...props}) => (
                <h1 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100" {...props} />
              ),
              h2: ({...props}) => (
                <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-4" {...props} />
              ),
              h3: ({...props}) => (
                <h3 className="text-base font-semibold text-gray-600 mb-2 mt-3" {...props} />
              ),
              p: ({...props}) => (
                <p className="text-sm text-gray-600 leading-relaxed mb-3" {...props} />
              ),
              ul: ({...props}) => (
                <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-gray-600" {...props} />
              ),
              ol: ({...props}) => (
                <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-gray-600" {...props} />
              ),
              li: ({...props}) => (
                <li className="text-sm text-gray-600" {...props} />
              ),
              code: ({className, children, ...props}) => {
                const isInline = !className
                return isInline ? (
                    <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                    {children}
                    </code>
                ) : (
                    <code className="block bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto mb-3" {...props}>
                    {children}
                    </code>
                )
                },
              blockquote: ({...props}) => (
                <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-500 text-sm mb-3" {...props} />
              ),
              strong: ({...props}) => (
                <strong className="font-semibold text-gray-800" {...props} />
              ),
              hr: ({...props}) => (
                <hr className="border-gray-100 my-4" {...props} />
              ),
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>

      </div>
    </div>
  )
}