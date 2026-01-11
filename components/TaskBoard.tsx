
import React, { useState } from 'react';
import { Task } from '../types';
import { breakdownTask } from '../services/geminiService';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    const id = Math.random().toString(36).substr(2, 9);
    const initialTask: Task = {
      id,
      title: newTaskTitle,
      status: 'todo',
      description: '',
      steps: []
    };
    
    setTasks([initialTask, ...tasks]);
    setNewTaskTitle('');
    
    setIsBreakingDown(true);
    const steps = await breakdownTask(newTaskTitle);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, steps } : t));
    setIsBreakingDown(false);
  };

  const toggleStep = (taskId: string, stepIndex: number) => {
    // This is a UI-only toggle for the demo
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Smart Tasks</h1>
          <p className="text-slate-400 mt-1">Let Aura AI break down your complex projects.</p>
        </div>
      </header>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What are you working on? (e.g. Launch a new product landing page)"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button
          onClick={addTask}
          disabled={isBreakingDown}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          {isBreakingDown ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          <span>Generate Roadmap</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md uppercase font-bold tracking-wider">
                Active
              </span>
            </div>
            
            {task.steps.length > 0 ? (
              <ul className="space-y-3">
                {task.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 items-start group/step">
                    <div className="w-5 h-5 mt-0.5 rounded border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-500 group-hover/step:border-indigo-500 transition-colors">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 opacity-50">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sm">Breaking down task...</p>
              </div>
            )}
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700">
            <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-slate-500 text-lg">No tasks yet. Enter one above to see the magic.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
