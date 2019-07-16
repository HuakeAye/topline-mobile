<template>
  <van-popup :style="{ height: '95%' }"
             :value="value"
             @input="$emit('input',$event)"
             position="bottom"
             get-container="body"
             :lazy-render="false">
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger"
                      plain
                      size="mini"
                      @click="isEdit = !isEdit">{{isEdit?'完成':'编辑'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content"
                :gutter="10"
                clickable>
        <van-grid-item v-for="(item,index) in userchannels"
                       :key="item.id"
                       @click="handleUserChannelClick(item,index)">
          <span class="text"
                :class="{active:index === activeIndex}">{{item.name}}</span>
          <van-icon v-show="isEdit"
                    class="close-icon"
                    name="close" />
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content"
                :gutter="10"
                clickable>
        <van-grid-item v-for="item in recommendChannels"
                       :key="item.id"
                       @click="handleAddChannel(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels, deleteUserChannel, resetUserChannels } from '../../../api/channel'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userchannels: {
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
      allChannels: [], // 所有频道列表
      isEdit: false, // 是否是编辑状态
      aliveChannels: ['推荐']
    }
  },
  computed: {
    recommendChannels () {
      const duplicates = this.userchannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const data = await getAllChannels()
      data.channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.allChannels = data.channels
    },
    async handleAddChannel (item) {
      this.userchannels.push(item)
      if (this.user) {
        const data = this.userchannels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        await resetUserChannels(data)
        return
      }
      window.localStorage.setItem('channels', JSON.stringify(this.userchannels))
    },
    changeChannel (item, index) { // 如果不是编辑状态
      this.$emit('update:active-index', index)
      this.$emit('input', false)
    },
    async deleteChannel (item, index) { // 是编辑状态
      this.userchannels.splice(index, 1)
      if (this.user) {
        await deleteUserChannel(item.id)
        return
      }
      window.localStorage.setItem('channels', JSON.stringify(this.userchannels))
    },
    handleUserChannelClick (item, index) {
      if (!this.isEdit) {
        this.changeChannel(item, index)
      } else {
        !this.aliveChannels.includes(item.name) && this.deleteChannel(item, index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    .action {
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
