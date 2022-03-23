<script setup lang="ts">

interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged: boolean
  adjacentMines: number
}
enum GameState {
  WAIT,
  GAMING,
  GAME_OVER,
  WIN,
  STOP
}
// const message
const WIDTH = 10
const HEIGHT = 10
const MINES_COUNT = 10
const flaggedBlocks = ref<BlockState[]>([])
const mineBlocks = ref<Pick<BlockState, 'x' | 'y'>[]>([])
const gameState = ref(GameState.WAIT)
const data = reactive(
  generateData()
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

function restartGame() {
  flaggedBlocks.value = []
  mineBlocks.value = []
  gameState.value = GameState.WAIT
  data.length = 0
  data.push(...generateData())
}

function generateData() {
  return Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false, flagged: false, mine: false }),
    ),
  )
}

function updateNumbers(block: BlockState) {
  if (block.revealed || gameState.value === GameState.GAME_OVER || block.flagged)
    return

  block.revealed = true

  if (block.mine) {
    mineBlocks.value.forEach(({ x, y }) => {
      data[y][x].revealed = true
    })

    gameState.value = GameState.GAME_OVER
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
  if (gameState.value !== GameState.GAMING || block.revealed) return

  if (block.flagged)
    flaggedBlocks.value = flaggedBlocks.value.filter(item => item !== block)
  else
    flaggedBlocks.value.push(block)

  block.flagged = !block.flagged

  if (flaggedBlocks.value.length === MINES_COUNT) {
    const isWin = mineBlocks.value.every(({ x, y }) => {
      return flaggedBlocks.value.some(({ x: flaggedX, y: flaggedY }) => flaggedX === x && flaggedY === y)
    })

    isWin && (gameState.value = GameState.WIN)
  }
}

function generateMines({ x: blockX, y: blockY }: BlockState) {
  const mines = []

  while (mines.length < MINES_COUNT) {
    const x = Math.floor(Math.random() * WIDTH)
    const y = Math.floor(Math.random() * HEIGHT)

    if (x === blockX && y === blockY)
      continue

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
  if (gameState.value === GameState.WAIT) {
    gameState.value = GameState.GAMING
    mineBlocks.value.push(...generateMines(block))
  }

  if (gameState.value !== GameState.GAMING)
    return

  updateNumbers(block)
}

</script>

<template>
  <div flex flex-col w-full text-center justify-center items-center>
    <p>扫雷</p>
    <div flex flex-col justify-center items-center w="400px">
      <div text-left self-stretch>
        <button border w-20 text-center my-2 @click="restartGame">
          重新开始
        </button>
      </div>
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
            gameState !== GameState.WAIT ?
              item.revealed || item.flagged ?
                item.flagged ?
                  '🚩' :
                  item.mine ?
                    '👹' :
                    item.adjacentMines
                : ''
              : ''
          }}
        </button>
      </div>
      <p v-if="gameState === GameState.GAME_OVER" text-red>
        游戏结束
      </p>
      <p v-if="gameState === GameState.WIN" text-green>
        你成功了
      </p>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
