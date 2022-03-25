<script setup lang="ts">
import type { BlockState } from '~/types/index'

const blockColors = [
  'text-transparent',
  'text-green-500',
  'text-blue-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-cyan-500'
]

defineProps<{ block: BlockState }>()

function getBlockClass(block: BlockState) {
  const classes = []

  if (!block.revealed)
    classes.push('bg-gray-100')

  if (block.mine && block.revealed)
    classes.push('border-red bg-red-300/50')
  else if (block.flagged)
    classes.push('text-black')
  else
    classes.push(blockColors[block.adjacentMines] ?? blockColors[blockColors.length - 1])

  return classes.join(' ')
}
</script>
<template>
  <button
    w-10
    h-10
    hover="bg-gray/20"
    border="1 gray-400/20"
    text-4
    leading-none
    :class="getBlockClass(block)"
  >
    {{
      block.revealed || block.flagged ?
        block.flagged ?
          '🚩' :
          block.mine ?
            '👹' :
            block.adjacentMines
        : ''
    }}
  </button>
</template>
