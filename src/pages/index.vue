<script setup lang="ts">
import type { BlockState } from '~/types/index'
import { GameState } from '~/types/index'

// const message
const WIDTH = 10
const HEIGHT = 10
const MINES_COUNT = 10
let flaggedBlocks = $ref<BlockState[]>([])
let mineBlocks = $ref<Pick<BlockState, 'x' | 'y'>[]>([])
let gameState = $ref(GameState.WAIT)
const data = reactive(
  generateData(WIDTH, HEIGHT)
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

function restartGame() {
  flaggedBlocks = []
  mineBlocks = []
  gameState = GameState.WAIT
  data.length = 0
  data.push(...generateData(WIDTH, HEIGHT))
}

function generateData(width: number, height: number) {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width },
      (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false, flagged: false, mine: false }),
    ),
  )
}

function updateNumbers(block: BlockState) {
  if (block.revealed || gameState === GameState.GAME_OVER || block.flagged)
    return

  block.revealed = true

  if (block.mine) {
    mineBlocks.forEach(({ x, y }) => {
      data[y][x].revealed = true
    })

    gameState = GameState.GAME_OVER
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
  if (gameState !== GameState.GAMING || block.revealed) return

  if (block.flagged)
    flaggedBlocks = flaggedBlocks.filter(item => item !== block)
  else
    flaggedBlocks.push(block)

  block.flagged = !block.flagged

  checkGameState()
}

function generateMines({ x: blockX, y: blockY }: BlockState, width: number, height: number) {
  const mines = []

  while (mines.length < MINES_COUNT) {
    const x = Math.floor(Math.random() * width)
    const y = Math.floor(Math.random() * height)

    if (x === blockX && y === blockY)
      continue

    if (!data[y][x].mine) {
      data[y][x].mine = true
      mines.push({ x, y })
    }
  }

  return mines
}

function checkGameState() {
  if (flaggedBlocks.length === MINES_COUNT) {
    const isWin = mineBlocks.every(({ x, y }) => {
      return data[y][x].mine
    })

    isWin && (gameState = GameState.WIN)
  }

  const unrevealedBlocks = data.flat(1).filter(block => !block.revealed)

  if (unrevealedBlocks.length === 10 && unrevealedBlocks.every(block => block.mine))
    gameState = GameState.WIN
}

function onButtonClick(block: BlockState) {
  if (gameState === GameState.WAIT) {
    gameState = GameState.GAMING
    mineBlocks.push(...generateMines(block, WIDTH, HEIGHT))
  }

  if (gameState !== GameState.GAMING)
    return

  updateNumbers(block)
  checkGameState()
}

// function aiPlay() {
//   if (gameState === GameState.WAIT) {
//     const x = Math.floor(Math.random() * WIDTH)
//     const y = Math.floor(Math.random() * HEIGHT)

//     onButtonClick(data[y][x])
//   }

//   let unrevealedBlocks = data.map(row => row.filter(block => !block.revealed && !block.flagged)).flat(1)
//   unrevealedBlocks.forEach(block => {
//     dir
//   })

// }

</script>

<template>
  <div flex flex-col w-full text-center justify-center items-center>
    <p>扫雷</p>
    <div flex flex-col justify-center items-center w="400px">
      <div text-left self-stretch>
        <button border w-20 text-center my-2 mr-2 @click="restartGame">
          重新开始
        </button>
        <!-- <button border w-20 text-center my-2 @click="aiPlay">ai</button> -->
      </div>
      <div v-for="row, y in data" :key="y" flex>
        <MyBlock
          v-for="item, x in row"
          :key="x"
          :block="item"
          @click="onButtonClick(item)"
          @contextmenu.prevent="setFlag(item)"
        />
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
