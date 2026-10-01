import React, { useState } from 'react';
import type { Task } from '../types/pomodoro';
import { X, Plus, Check, Trash2, Target, Hourglass } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0a0e14] text-amber-100 rounded-3xl border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85dvh] m-auto font-chronos"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-black/40">
          <div className="flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-amber-400" />
            <h2 id="task-modal-title" className="text-lg font-bold text-amber-200">
              Zamanın Görevleri
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {tasks.filter((t) => !t.isCompleted).length} aktif
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-xl text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-amber-500/20 bg-black/30 text-xs">
          <span className="text-amber-400/70">Filtrele:</span>
          <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-xl border border-amber-500/20">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 shadow-xs'
                  : 'text-amber-400/60 hover:text-amber-200'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'active'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 shadow-xs'
                  : 'text-amber-400/60 hover:text-amber-200'
              }`}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'completed'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 shadow-xs'
                  : 'text-amber-400/60 hover:text-amber-200'
              }`}
            >
              Tamamlanan
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-amber-400/60 text-sm">
              {filter === 'completed'
                ? 'Henüz mühürlenmiş görev yok.'
                : filter === 'active'
                ? 'Tüm görevler mühürlendi, zaman seninle!'
                : 'Listen henüz boş. Aşağıdan yeni bir irade hedefi ekleyebilirsin.'}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isActive = activeTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? 'border-amber-400/70 bg-amber-500/15 shadow-sm shadow-amber-500/20'
                      : 'border-amber-500/20 bg-black/40 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task.id)}
                      aria-label={task.isCompleted ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        task.isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-amber-500/40 hover:border-emerald-400 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium truncate transition-all ${
                          task.isCompleted
                            ? 'line-through text-amber-400/40'
                            : 'text-amber-100'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400/70">
                        <span className="flex items-center gap-0.5">
                          <span aria-hidden="true">⏳</span>
                          <span className="font-semibold text-amber-200">
                            {task.completedPomodoros}
                          </span>
                          <span>/</span>
                          <span>{task.estimatedPomodoros}</span>
                        </span>

                        {task.completedPomodoros >= task.estimatedPomodoros && (
                          <span className="text-[11px] text-emerald-400 font-medium ml-1">
                            Zafer kazanıldı
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
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-black shadow-xs'
                            : 'bg-black/60 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
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
                      className="p-1.5 rounded-lg text-amber-400/50 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
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
        <div className="p-4 border-t border-amber-500/20 bg-black/40">
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-400/60 text-amber-300/80 hover:text-amber-200 flex items-center justify-center gap-2 text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Görev Belirle</span>
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="Görev adı..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-amber-500/40 bg-black/60 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-400/80">
                  Tahmini Süre (Kum Saati):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEstimatedPomodoros((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-black/60 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-300 cursor-pointer hover:bg-amber-500/20"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs px-2 text-amber-200">
                    ⏳ {estimatedPomodoros}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEstimatedPomodoros((prev) => Math.min(10, prev + 1))}
                    className="w-7 h-7 rounded-lg bg-black/60 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-300 cursor-pointer hover:bg-amber-500/20"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-amber-400/60 hover:text-amber-200 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black hover:from-amber-500 hover:to-yellow-400 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Mühürle & Kaydet
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
