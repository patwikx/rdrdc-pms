'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PlusCircle, MoreHorizontal, User, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Define the Task type
type Task = {
  id: string
  content: string
  property: string
  assignedTo: string
  description: string
}

// Define the TasksState type
type TasksState = {
  todo: Task[]
  inProgress: Task[]
  done: Task[]
}

// Mock data for tasks
const initialTasks: TasksState = {
  todo: [
    { id: 'task-1', content: 'Fix leaky faucet in Apt 101', property: 'RDRDC Office', assignedTo: 'Larry Paler', description: 'The kitchen faucet is leaking. Please fix it as soon as possible.' },
    { id: 'task-2', content: 'Schedule pest control for Apt 205', property: 'Tambykez', assignedTo: 'Jimster Santillan', description: 'Tenant reported seeing ants. Schedule a pest control visit.' },
  ],
  inProgress: [
    { id: 'task-3', content: 'Replace carpet in Apt 302', property: 'PAG-IBIG Office', assignedTo: 'Kristian Quizon', description: 'The carpet in the living room is worn out and needs replacement.' },
    { id: 'task-4', content: 'Paint hallway on 2nd floor', property: 'RD Hardware Santiago', assignedTo: 'Argie Tacay', description: 'Repaint the hallway walls on the 2nd floor. Use the approved color scheme.' },
  ],
  done: [
    { id: 'task-5', content: 'Install new locks in Apt 404', property: 'RD Retail Office Cagampang Ext.', assignedTo: 'Rayan Sarip', description: 'Replace the old locks with new smart locks in Apartment 404.' },
    { id: 'task-6', content: 'Repair AC unit in Apt 501', property: 'RDRDC Office', assignedTo: 'Cezar Regalado', description: 'The AC unit in Apartment 501 is not cooling properly. Repair or replace if necessary.' },
  ],
}

// Mock data for users
const users = [
  { id: 'user-1', name: 'Larry Paler' },
  { id: 'user-2', name: 'Jimster Santillan' },
  { id: 'user-3', name: 'Kristian Quizon' },
  { id: 'user-4', name: 'Argie Tacay' },
  { id: 'user-5', name: 'Rayan Sarip' },
  { id: 'user-6', name: 'Cezar Regalado' },
]

// Mock data for properties
const properties = [
  { id: 'prop-1', name: 'RDRDC Office' },
  { id: 'prop-2', name: 'Tambykez' },
  { id: 'prop-3', name: 'PAG-IBIG Office' },
  { id: 'prop-4', name: 'RD Hardware Santiago' },
  { id: 'prop-5', name: 'RD Retail Office Cagampang Ext.' },
]

const KanbanForm = () => {
  const [tasks, setTasks] = useState<TasksState>(initialTasks)
  const [newTask, setNewTask] = useState({
    content: '',
    property: '',
    assignedTo: '',
    description: '',
  })

  const onDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = tasks[source.droppableId as keyof TasksState]
    const destColumn = tasks[destination.droppableId as keyof TasksState]
    const [removed] = sourceColumn.splice(source.index, 1)
    destColumn.splice(destination.index, 0, removed)

    setTasks({ ...tasks })
  }

  const addTask = (columnId: keyof TasksState) => {
    if (newTask.content.trim() !== '') {
      const newTaskObj = {
        id: `task-${Date.now()}`,
        ...newTask
      }
      setTasks(prev => ({
        ...prev,
        [columnId]: [newTaskObj, ...prev[columnId]]
      }))
      setNewTask({
        content: '',
        property: '',
        assignedTo: '',
        description: '',
      })
    }
  }

  const TaskCard = ({ task, provided }: { task: Task, provided: any }) => (
<Card
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  className="p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg border"
>
  <div className="flex justify-between items-start">
    <div className="flex flex-col">
      <p className="font-bold text-lg">{task.content}</p>
      <p className="text-sm ">{task.property}</p>
      <p className="text-sm flex items-center mt-1">
        <User className="h-4 w-4 mr-1 text-gray-400" />
        {task.assignedTo}
      </p>
    </div>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal className="h-4 w-4 hover:text-gray-800" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg transition-transform duration-200 transform">
  <DialogHeader className="border-b pb-4 mb-4">
    <DialogTitle className="text-xl font-semibold">{task.content}</DialogTitle>
    <DialogDescription className="text-sm">{task.property}</DialogDescription>
  </DialogHeader>

  <div className="mt-4 space-y-6">
    <div className="flex items-center space-x-2">
      <Label>Assigned To</Label>
      <User className="h-5 w-5" />
    </div>
    <p className="font-semibold border rounded-md p-2">
      {task.assignedTo}
    </p>

    <div className="flex items-center space-x-2">
      <Label className="font-medium">Description</Label>
      <Info className="h-5 w-5 text-gray-500" />
    </div>
    <Textarea readOnly>{task.description}</Textarea>
  </div>

  <div className="mt-6 flex justify-end">
    <Button variant="outline" size='sm' className="text-blue-600">
      Edit Task
    </Button>
    <Button variant='destructive' size='sm' className="ml-2">
      Delete Task
    </Button>
  </div>
</DialogContent>
    </Dialog>
  </div>
</Card>
  )

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col'>
        <div className='flex-1 p-6 space-y-4'>
          <h1 className="text-3xl font-bold mt-[-25px]">Maintenance Tasks</h1>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-6 h-[calc(100vh-200px)]">
              {Object.entries(tasks).map(([columnId, columnTasks]) => (
                <div key={columnId} className="flex-1">
                  <Card className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 border-b">
                      <CardTitle className="text-xl font-semibold capitalize">{columnId.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                      {columnId === 'todo' && (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-lg shadow-lg">
  <DialogHeader>
    <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
    <DialogDescription className="text-sm text-muted-foreground">
      Assign a task to the {columnId} column.
    </DialogDescription>
  </DialogHeader>
  <div className="space-y-6 py-6">
    <div className="space-y-4">
      <Label htmlFor="task-name" className="block text-sm font-medium">
        Task Name
      </Label>
      <Input
        id="task-name"
        value={newTask.content}
        onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
        className="block w-full border  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter task name"
      />
    </div>
    <div className="space-y-4">
      <Label htmlFor="task-property" className="block text-sm font-medium">
        Property
      </Label>
      <Select
        onValueChange={(value) => setNewTask({ ...newTask, property: value })}
      >
        <SelectTrigger className="border rounded-md focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent className=" rounded-md border ">
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.name}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-4">
      <Label htmlFor="assigned-to" className="block text-sm font-medium text-gray-700">
        Assigned To
      </Label>
      <Select
        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
      >
        <SelectTrigger className="border  rounded-md focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="Assign to user" />
        </SelectTrigger>
        <SelectContent className=" rounded-md border">
          {users.map((user) => (
            <SelectItem key={user.id} value={user.name}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-4">
      <Label htmlFor="task-description" className="block text-sm font-medium ">
        Task Description
      </Label>
      <Textarea
        id="task-description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        className="block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter task description"
      />
    </div>
  </div>
  <DialogFooter className="flex justify-end space-x-2">
    <Button variant="secondary">Cancel</Button>
    <Button
      className="bg-indigo-600 hover:bg-indigo-500"
      onClick={() => addTask(columnId as keyof TasksState)}
    >
      Create Task
    </Button>
  </DialogFooter>
</DialogContent>

    </Dialog>
  )}
                    </CardHeader>
                    <ScrollArea className="flex-1 overflow-y-auto p-4">
                      <Droppable droppableId={columnId}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {columnTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => <TaskCard task={task} provided={provided} />}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </ScrollArea>
                  </Card>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  )
}

export default KanbanForm
