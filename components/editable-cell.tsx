"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditableCellProps {
  value: string | number
  onSave: (value: string) => Promise<void>
  className?: string
  type?: "text" | "number" | "textarea" | "select"
  options?: { value: string; label: string }[]
  renderValue?: (value: string | number, options?: { value: string; label: string }[]) => React.ReactNode
}

export function EditableCell({ value, onSave, className = "", type = "text", options = [], renderValue }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current && type !== "select") {
      inputRef.current.focus()
      if (type === "textarea") {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(String(value))
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && type !== "textarea") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        {type === "select" ? (
          <div className="flex items-center gap-1 flex-1">
            <Select
              value={editValue}
              onValueChange={async (newValue) => {
                if (newValue !== editValue) {
                  setEditValue(newValue)
                  setIsSaving(true)
                  try {
                    await onSave(newValue)
                    setIsEditing(false)
                  } catch (error) {
                    console.error("Error saving:", error)
                    alert("Erreur lors de la sauvegarde")
                    setEditValue(String(value)) // Revert on error
                  } finally {
                    setIsSaving(false)
                  }
                }
              }}
            >
              <SelectTrigger className="flex-1 min-w-[100px] h-7 text-xs" disabled={isSaving}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        ) : type === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-[100px] px-1 py-0.5 text-xs border border-blue-300 rounded ${className}`}
            rows={2}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-[50px] px-1 py-0.5 text-xs border border-blue-300 rounded ${className}`}
          />
        )}
        {type !== "select" && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={isSaving}
              className="h-6 w-6 p-0"
            >
              <Check className="h-3 w-3 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </>
        )}
      </div>
    )
  }

  // Custom render function
  if (renderValue) {
    return (
      <div
        className={`group relative flex items-center gap-1 ${className}`}
        onDoubleClick={() => setIsEditing(true)}
      >
        <div className="flex-1">{renderValue(value, options)}</div>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-200 rounded"
          title="Double-cliquer pour éditer"
        >
          <Pencil className="h-3 w-3 text-slate-500" />
        </button>
      </div>
    )
  }

  // For select type, show value with edit button
  if (type === "select" && options.length > 0) {
    const selectedOption = options.find(opt => opt.value === String(value)) || { label: String(value) }
    return (
      <div
        className={`group relative flex items-center gap-1 ${className}`}
        onDoubleClick={() => setIsEditing(true)}
      >
        <span className="flex-1">{selectedOption.label}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-200 rounded"
          title="Double-cliquer pour éditer"
        >
          <Pencil className="h-3 w-3 text-slate-500" />
        </button>
      </div>
    )
  }

  return (
    <div
      className={`group relative flex items-center gap-1 ${className}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      <span className="flex-1">{value}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-200 rounded"
        title="Double-cliquer pour éditer"
      >
        <Pencil className="h-3 w-3 text-slate-500" />
      </button>
    </div>
  )
}

