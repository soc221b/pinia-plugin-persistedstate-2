<script setup lang="ts">
import { useRepo } from 'pinia-orm'
import { Todo } from './models/Todo'
import { computed, onMounted, ref } from 'vue'

const todoRepo = useRepo(Todo)
const todos = computed(() => todoRepo.all())

const newTodoTitle = ref('')
const addTodo = () => {
  const todo = todoRepo.make({
    title: newTodoTitle.value,
  })
  todoRepo.save(todo)
  newTodoTitle.value = ''
}

const toggleTodo = (id: string) => {
  const todo = todoRepo.find(id)
  if (!todo) return

  todoRepo.save({ ...todo, done: !todo.done })
}

const removeTodo = (id: string) => {
  todoRepo.destroy(id)
}

const initialTodos = [
  {
    id: 'Q2p4eXZ9VUXb2PLLMBOyY',
    title: 'Eat',
    done: true,
  },
  {
    id: 'G-bzoEWnauR5-zNBmeDhy',
    title: 'Code',
    done: true,
  },
  {
    id: 'SB2n1TB8VDqAmXcOkT-MU',
    title: 'Sleep',
  },
]
onMounted(() => {
  if (todos.value.length === 0) {
    todoRepo.save(initialTodos)
  }
})
</script>

<template>
  <main style="max-width: 480px; margin: 20px auto">
    <h1>Todo App</h1>

    <section>
      <ul>
        <li>
          <form @submit.prevent="addTodo">
            <input v-model="newTodoTitle" />
          </form>
        </li>
        <template v-for="todo of todos" :key="todo.id">
          <li>
            <input
              :checked="todo.done"
              @change="() => toggleTodo(todo.id)"
              type="checkbox"
            />
            {{ todo.title }}
            <a @click="() => removeTodo(todo.id)" href="#" aria-label="Close"
              >x</a
            >
          </li>
        </template>
      </ul>
    </section>
  </main>
</template>
