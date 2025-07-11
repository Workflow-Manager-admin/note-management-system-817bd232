"use client";
import React, { useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now();
}

const COLORS = {
  primary: "#2563eb",
  secondary: "#64748b",
  accent: "#fbbf24",
  bgSidebar: "#f8fafc", // light gray blue
  border: "#e5e7eb",
};

function Sidebar({
  notes,
  selectedNoteId,
  onSelect,
  onCreate,
}: {
  notes: Note[];
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <aside
      className="flex flex-col h-full border-r"
      style={{ borderColor: COLORS.border, background: COLORS.bgSidebar, minWidth: 220, maxWidth: 320 }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.border, background: "#fff" }}>
        <h2 className="text-lg font-semibold text-[color:var(--color-foreground)]">Notes</h2>
        <button
          aria-label="Add Note"
          onClick={onCreate}
          className="rounded bg-[color:var(--color-background)] border px-2 py-1 text-[color:var(--color-foreground)] text-lg hover:bg-[color:primary]/10 transition border-gray-200"
          style={{
            borderColor: COLORS.primary,
            color: COLORS.primary,
          }}
          title="Create new note"
        >
          +
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto pt-2">
        <ul className="space-y-1 px-2">
          {notes.length === 0 && (
            <li className="px-4 py-2 text-sm text-[color:var(--color-foreground)] text-opacity-60">No notes yet.</li>
          )}
          {notes.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => onSelect(n.id)}
                className={`w-full px-3 py-2 text-left rounded ${
                  selectedNoteId === n.id
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                style={
                  selectedNoteId === n.id
                    ? {
                        background: "#e0e7ff",
                        color: COLORS.primary,
                      }
                    : {
                        color: COLORS.secondary,
                      }
                }
              >
                <span className="block truncate">{n.title || <em>(No title)</em>}</span>
                <span className="block text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <footer className="text-xs px-5 py-2 text-gray-400">
        <span>
          <strong>Notes App</strong> • Minimal UI
        </span>
      </footer>
    </aside>
  );
}

function NoteEditor({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note | null;
  onUpdate: (newNote: Note) => void;
  onDelete: (id: string) => void;
}) {
  // Controlled local state for edited fields
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [editing, setEditing] = useState(Boolean(note));
  // Update local state if note prop changes
  React.useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
    setEditing(Boolean(note));
  }, [note]);
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 h-full min-h-[300px]">
        <span className="text-2xl">📝</span>
        <span className="mt-3">Create or select a note to get started.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-6">
      <div className="flex gap-2 mb-3 items-center">
        <input
          className="w-full rounded px-3 py-2 border border-gray-200 text-lg bg-white outline-none focus:border-blue-300 transition"
          placeholder="Title"
          value={title}
          style={{
            borderColor: COLORS.primary,
            color: COLORS.primary,
            background: "#fff",
            fontWeight: "500",
            letterSpacing: 0.1,
          }}
          onChange={(e) => {
            setTitle(e.target.value);
            setEditing(true);
          }}
        />
        <button
          aria-label="Delete note"
          onClick={() => onDelete(note.id)}
          className="ml-2 px-3 py-2 rounded bg-[color:var(--color-background)] text-red-500 border border-gray-200 hover:bg-red-50 transition"
          style={{ borderColor: COLORS.border }}
        >
          Delete
        </button>
      </div>
      <textarea
        className="flex-1 rounded px-3 py-2 border border-gray-200 text-base bg-white resize-none min-h-[200px] outline-none focus:border-blue-300 transition"
        placeholder="Start writing your note..."
        value={content}
        style={{
          borderColor: COLORS.secondary,
          color: COLORS.secondary,
          background: "#fff",
        }}
        onChange={(e) => {
          setContent(e.target.value);
          setEditing(true);
        }}
      />
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => {
            setTitle(note.title);
            setContent(note.content);
            setEditing(false);
          }}
          disabled={!editing}
          className="rounded border border-gray-200 px-4 py-1 text-gray-500 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onUpdate({
              ...note,
              title: title.trim() || "Untitled Note",
              content,
            });
            setEditing(false);
          }}
          disabled={!editing}
          className="rounded border px-5 py-1 text-white"
          style={{
            background: COLORS.primary,
            borderColor: COLORS.primary,
            opacity: editing ? 1 : 0.7,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => [
    // Demo note to give a visual start (remove in prod)
    // {
    //   id: generateId(),
    //   title: "Welcome!",
    //   content: "Write, edit and delete notes in a minimal UI.",
    //   createdAt: Date.now(),
    // }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Create new note
  function handleCreate() {
    const id = generateId();
    const createdAt = Date.now();
    const newNote: Note = {
      id,
      createdAt,
      title: "",
      content: "",
    };
    setNotes((prev) => [{ ...newNote }, ...prev]);
    setSelectedId(id);
  }
  // Update note
  function handleUpdate(updated: Note) {
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? { ...updated } : n))
    );
  }
  // Delete note
  function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    // Select another note or none
    setSelectedId((prevSelected) => {
      if (prevSelected === id) {
        const remaining = notes.filter((n) => n.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      }
      return prevSelected;
    });
  }
  // Select note
  function handleSelect(id: string) {
    setSelectedId(id);
  }

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="flex flex-col md:flex-row h-[95vh] md:h-[90vh] min-h-[500px] rounded-md overflow-hidden shadow-lg border border-gray-200 max-w-6xl mx-auto my-10 bg-white font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        selectedNoteId={selectedId}
        onSelect={handleSelect}
        onCreate={handleCreate}
      />
      {/* Main Content */}
      <main className="flex-1 min-w-0 h-full bg-white overflow-auto">
        <NoteEditor
          note={selectedNote}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
