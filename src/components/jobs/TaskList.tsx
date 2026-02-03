import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Trash2, Check, X } from 'lucide-react';
import { Task } from '../../data/jobs';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedTasks = items.map((task, index) => ({
      ...task,
      order: index,
    }));

    onTasksChange(updatedTasks);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      jobId: tasks[0]?.jobId || '',
      content: newTaskContent,
      completed: false,
      order: tasks.length,
    };

    onTasksChange([...tasks, newTask]);
    setNewTaskContent('');
  };

  const handleToggleTask = (taskId: string) => {
    onTasksChange(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingContent(task.content);
  };

  const handleEditSave = () => {
    if (editingTaskId) {
      onTasksChange(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, content: editingContent.trim() }
            : task
        )
      );
      setEditingTaskId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTask(e);
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddTask}
          className="inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks
                .sort((a, b) => a.order - b.order)
                .map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group flex items-center gap-3 rounded-lg border p-3 ${
                          snapshot.isDragging
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {editingTaskId === task.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className="flex-1 rounded border-slate-300 px-2 py-1"
                            />
                            <button
                              type="button"
                              onClick={handleEditSave}
                              className="p-1 text-emerald-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleEditCancel}
                              className="p-1 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => startEditing(task)}
                            className={`flex-1 cursor-pointer ${
                              task.completed
                                ? 'text-slate-400 line-through'
                                : 'text-slate-700'
                            }`}
                          >
                            {task.content}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
