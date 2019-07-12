<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页"
                   fixed />
      <van-tabs class="channel-tabs"
                v-model="activeChannelIndex">
        <van-tab :title="channelsItem.name"
                 v-for="channelsItem in channels"
                 :key="channelsItem.id">
          <van-pull-refresh v-model="downPullLoading"
                            @refresh="onRefresh">
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      @load="onLoad">
              <van-cell v-for="item in list"
                        :key="item"
                        :title="item" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannels } from '../../api/channel'
export default {
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      downPullLoading: false,
      channels: []
    }
  },
  created () {
    this.loadchannels()
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.downPullLoading = false
      }, 500)
    },
    async loadchannels () {
      const { user } = this.$store.state

      let channels = []

      // 已登录
      if (user) {
        const data = await getUserChannels()
        console.log(data)
        channels = data.channels
      } else {
        // 未登录

        // 如果有本地存储数据则使用本地存储中的频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有本地存储频道数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }

      // 修改 channels，将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        // item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })

      this.channels = channels
    }
  }
}
</script>

<style lang="less" scope>
.channel-tabs {
  margin-top: 100px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content {
  margin-bottom: 100px;
}
</style>
