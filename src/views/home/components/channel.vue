<template>
  <van-popup :value="value"
             @input="$emit('input',$event)"
             position="bottom"
             :style="{ height: '95%' }">
    <div class="colse"></div>
    <div class="channels">
      <div class="head">
        <div>
          <span class="wochannels">我的频道</span>
          <span class="clickhannels"> 点击进入频道</span>
        </div>
        <div>
          <van-button size="mini"
                      type="info">编辑</van-button>
        </div>
      </div>
      <div class="content">
        <van-grid :gutter="10"
                  clickable>
          <van-grid-item v-for="(channelItem,index) in channels"
                         :key="channelItem.id">
            <span slot="text"
                  class="text"
                  :class="{active:index === activeIndex}">{{channelItem.name}}</span>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.wochannels {
  font-size: 24px;
}
.clickhannels {
  font-size: 24px;
}
.head {
  display: flex;
  justify-content: space-between;
}
.channels {
  .content {
    .text {
      font-size: 22px;
    }
    .active {
      color: red;
    }
  }
}
</style>
