import React, { useState } from 'react';
import type { Task } from '../types/pomodoro';
import { X, Plus, Check, Trash2, Target, CheckSquare } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  activeTaskId: string | null;
  onSelectActiveTask: (id: string | null) => void;
  onUpdateTasks: (updater: (prev: Task[]) => Task[]) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onUpdateTasks,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  if (!isOpen) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: newTitle.trim(),
      estimatedPomodoros: Math.max(1, estimatedPomodoros),
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: Date.now(),
    };

    onUpdateTasks((prev) => [newTask, ...prev]);

    if (!activeTaskId) {
      onSelectActiveTask(newTask.id);
    }

    setNewTitle('');
    setEstimatedPomodoros(1);
    setIsAdding(false);
  };

  const handleToggleComplete = (id: string) => {
    onUpdateTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks((prev) => prev.filter((task) => task.id !== id));
    if (activeTaskId === id) {
      onSelectActiveTask(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-rose-500" />
            <h2 id="task-modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Görevler
            </h2>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {tasks.filter((t) => !t.isCompleted).length} aktif
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20">
          <span className="text-xs text-zinc-500">Görev Filtresi:</span>
          <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800 p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'active'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Bitenler
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
              {filter === 'completed'
                ? 'Henüz tamamlanmış görev yok.'
                : filter === 'active'
                ? 'Tüm görevler bitti, harikasın!'
                : 'Listen henüz boş. Aşağıdan yeni bir görev ekleyebilirsin.'}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isActive = activeTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task.id)}
                      aria-label={task.isCompleted ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        task.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-zinc-300 dark:border-zinc-600 hover:border-emerald-500 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium truncate transition-all ${
                          task.isCompleted
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-0.5">
                          <span aria-hidden="true">🍅</span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {task.completedPomodoros}
                          </span>
                          <span>/</span>
                          <span>{task.estimatedPomodoros}</span>
                        </span>

                        {task.completedPomodoros >= task.estimatedPomodoros && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium ml-1">
                            Hedefe ulaşıldı
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {!task.isCompleted && (
                      <button
                        type="button"
                        onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300'
                        }`}
                        title={isActive ? 'Aktif görevi kaldır' : 'Bu göreve odaklan'}
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>{isActive ? 'Aktif' : 'Odaklan'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Görevi Sil"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Add Task Area */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-300 flex items-center justify-center gap-2 text-sm font-medium transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Görev Ekle</span>
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="Görev adı..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Tahmini Pomodoro:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEstimatedPomodoros((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs px-2 text-zinc-800 dark:text-zinc-200">
                    🍅 {estimatedPomodoros}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEstimatedPomodoros((prev) => Math.min(10, prev + 1))}
                    className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 text-xs font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
