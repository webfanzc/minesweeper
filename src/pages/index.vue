<script setup lang="ts">

interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged: boolean
  adjacentMines: number
}
// const message
const WIDTH = 10
const HEIGHT = 10
const MINES_COUNT = 10
const flaggedBlocks = ref<BlockState[]>([])
const mineBlocks = ref<Pick<BlockState, 'x' | 'y'>[]>([])
const gameStart = ref(false)
const gameOver = ref(false)
const data = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false, flagged: false, mine: false }),
    ),
  ),
)

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

const blockColors = [
  'text-transparent',
  'text-green-500',
  'text-blue-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500'
]

function updateNumbers(block: BlockState) {
  if (block.revealed || gameOver.value || block.flagged)
    return

  block.revealed = true

  if (block.mine) {
    gameOver.value = true
    return
  }

  directions.forEach(([dy, dx]) => {
    if (data[block.y + dy]?.[block.x + dx]?.mine)
      block.adjacentMines++
  })
  if (block.adjacentMines === 0) {
    directions.forEach(([dy, dx]) => {
      const recurseBlock = data[block.y + dy]?.[block.x + dx]
      recurseBlock && updateNumbers(recurseBlock)
    })
  }
}
function setFlag(block: BlockState) {
  if (block.flagged)
    flaggedBlocks.value = flaggedBlocks.value.filter(item => item !== block)
  else
    flaggedBlocks.value.push(block)

  block.flagged = !block.flagged

  if (flaggedBlocks.value.length === MINES_COUNT) {
    mineBlocks.value.forEach(({ x, y }) => {

    })
  }
}

function generateMines({ x: blockX, y: blockY }: BlockState) {
  const mines = []

  while (mines.length < MINES_COUNT) {
    const x = Math.floor(Math.random() * WIDTH)
    const y = Math.floor(Math.random() * HEIGHT)

    if (x === blockX && y === blockY)
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

  if (!block.revealed)
    classes.push('bg-gray-100')

  if (block.mine && block.revealed)
    classes.push('border-red bg-red-300/50')
  else if (block.flagged)
    classes.push('text-black')
  else
    classes.push(blockColors[block.adjacentMines] ?? blockColors.at(blockColors.length - 1))
  return classes.join(' ')
}

function onButtonClick(block: BlockState) {
  if (!gameStart.value) {
    gameStart.value = true
    mineBlocks.value.push(...generateMines(block))
  }

  updateNumbers(block)
}

</script>

<template>
  <div flex flex-col w-full>
    <p>扫雷</p>
    <p v-if="gameOver" text-red>游戏结束</p>
    <div flex flex-col justify-center items-center>
      <div v-for="row, y in data" :key="y" flex>
        <button
          v-for="item, x in row"
          :key="x"
          w-10
          h-10
          hover="bg-gray/20"
          border="1 gray-400/20"
          text-4
          leading-none
          :class="getBlockClass(item)"
          @click="onButtonClick(item)"
          @contextmenu.prevent="setFlag(item)"
        >
          {{
            gameStart ?
              item.revealed || item.flagged ?
                item.flagged ?
                  '1' :
                  item.mine ?
                    '👹' :
                    item.adjacentMines
                : ''
              : ''
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
