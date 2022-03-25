import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MyBlock from '~/components/MyBlock.vue'

describe('MyBlock.vue', () => {
  it('should render', () => {
    const wrapper = mount(MyBlock, {
      props: {
        block: {
          x: 1,
          y: 2,
          flagged: false,
          revealed: false,
          mine: false,
          adjacentMines: 0
        }
      }
    })
    expect(wrapper.text()).toMatchSnapshot('""')
  })

  it('should render mine', () => {
    const wrapper = mount(MyBlock, {
      props: {
        block: {
          x: 1,
          y: 2,
          flagged: false,
          revealed: true,
          mine: true,
          adjacentMines: 0
        }
      }
    })
    expect(wrapper.text()).toMatchInlineSnapshot('"👹"')
  })

  it('should render flag', () => {
    const wrapper = mount(MyBlock, {
      props: {
        block: {
          x: 1,
          y: 2,
          flagged: true,
          revealed: true,
          mine: false,
          adjacentMines: 0
        }
      }
    })
    expect(wrapper.text()).toMatchSnapshot('"🚩"')
  })

  it('should render adjacentMines', () => {
    const wrapper = mount(MyBlock, {
      props: {
        block: {
          x: 1,
          y: 2,
          flagged: false,
          revealed: true,
          mine: false,
          adjacentMines: 3
        }
      }
    })
    expect(wrapper.text()).toMatchInlineSnapshot('"3"')
  })
})
