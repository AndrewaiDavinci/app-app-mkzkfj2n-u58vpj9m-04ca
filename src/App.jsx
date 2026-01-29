import { useState, useEffect } from 'react'
import { Plus, Circle, CheckCircle2, Trash2 } from 'lucide-react'
import { cn } from './lib/utils'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  // 로컬 스토리지에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        setTodos(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load todos:', error)
      }
    }
  }, [])

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // 할 일 추가
  const addTodo = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setTodos(prev => [...prev, {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }])
    setInput('')
  }

  // 완료 토글
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 삭제
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  // 필터링
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            할 일 관리
          </h1>
          <p className="text-gray-600 mt-1 text-sm">오늘 할 일을 효율적으로 관리하세요</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 transition-all hover:shadow-md">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-600 mt-0.5">전체</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-4 border border-blue-200 transition-all hover:shadow-md">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-xs text-blue-800 mt-0.5">진행중</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-4 border border-purple-200 transition-all hover:shadow-md">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-xs text-purple-800 mt-0.5">완료</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="새로운 할 일을 입력하세요..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">추가</span>
            </button>
          </div>
        </form>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { value: 'all', label: '전체' },
            { value: 'active', label: '진행중' },
            { value: 'completed', label: '완료' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                'px-5 py-2.5 rounded-xl transition-all font-medium text-sm',
                filter === value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <div className="text-gray-300 mb-3">
                <Circle className="w-16 h-16 mx-auto" strokeWidth={1.5} />
              </div>
              <p className="text-gray-500 font-medium">
                {filter === 'all' && '할 일이 없습니다'}
                {filter === 'active' && '진행중인 할 일이 없습니다'}
                {filter === 'completed' && '완료한 할 일이 없습니다'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === 'all' && '새로운 할 일을 추가해보세요!'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={cn(
                  'bg-white rounded-xl shadow-sm p-4 border transition-all hover:shadow-md group animate-in fade-in slide-in-from-bottom-2',
                  todo.completed
                    ? 'border-purple-200 bg-gradient-to-r from-purple-50/50 to-transparent'
                    : 'border-gray-200'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      'flex-shrink-0 w-7 h-7 rounded-full transition-all hover:scale-110',
                      todo.completed
                        ? 'text-purple-500 hover:text-purple-600'
                        : 'text-gray-400 hover:text-blue-500'
                    )}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-7 h-7" strokeWidth={2} />
                    ) : (
                      <Circle className="w-7 h-7" strokeWidth={2} />
                    )}
                  </button>

                  <span
                    className={cn(
                      'flex-1 transition-all text-base',
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800 font-medium'
                    )}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            총 {stats.total}개의 할 일 중 {stats.completed}개 완료
            {stats.completed > 0 && ` (${Math.round((stats.completed / stats.total) * 100)}%)`}
          </div>
        )}
      </div>
    </div>
  )
}

export default App