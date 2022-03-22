<script setup lang="ts">import type { Nullable } from 'vitest'

interface BlockState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}
// const message
const WIDTH = 10
const HEIGHT = 10
const gameStart = ref(false)
const data = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0 }),
    ),
  ),
)
const startBlock = ref<Nullable<BlockState>>(null)

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

function updateNumbers() {
  data.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return

      directions.forEach(([dy, dx]) => {
        if (data[y + dy]?.[x + dx]?.mine)
          block.adjacentMines++
      })
    })
  })
}

function generateMines() {
  const mines = []

  while (mines.length < 10) {
    const x = Math.floor(Math.random() * WIDTH)
    const y = Math.floor(Math.random() * HEIGHT)
    if (x === startBlock.value?.x && y === startBlock.value?.y)
      return

    if (!data[y][x].mine) {
      data[y][x].mine = true
      mines.push({ x, y })
    }
  }

  return mines
}

function getBlockClass(block: BlockState) {
  const classes = []

  if (block.mine)
    classes.push('border-red')
  if (block.adjacentMines >= 3)
    classes.push('text-red')
  else if (block.adjacentMines >= 2)
    classes.push('text-yellow')
  else if (block.adjacentMines >= 1)
    classes.push('text-green')

  return classes.join(' ')
}

function onButtonClick(block: BlockState) {
  if (!startBlock.value) {
    startBlock.value = block
    gameStart.value = true
    generateMines()
  }

  updateNumbers()
}

</script>

<template>
  <div>
    <p>Minesweeper</p>
    <div v-for="row, y in data" :key="y">
      <button
        v-for="item, x in row"
        :key="x"
        w-10
        h-10
        hover:bg-gray
        border
        :class="getBlockClass(item)"
        @click="onButtonClick(item)"
      >
        {{
          gameStart ?
            item.mine ?
              '👹' :
              item.adjacentMines
            : ''
        }}
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
