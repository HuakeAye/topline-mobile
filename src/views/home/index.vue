<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页"
                   fixed />
      <van-tabs class="channel-tabs"
                v-model="activeChannelIndex">
        <div slot="nav-right"
             class="wap-nav"
             @click="ischannelshow = true">
          <van-icon name="wap-nav" />
        </div>
        <van-tab :title="channelsItem.name"
                 v-for="channelsItem in channels"
                 :key="channelsItem.id">
          <van-pull-refresh v-model="channelsItem.downPullLoading"
                            @refresh="onRefresh"
                            :success-text="channelsItem.downPullSuccessText"
                            :success-duration="2000">
            <van-list v-model="channelsItem.upPullLoading"
                      :finished="channelsItem.upPullFinished"
                      finished-text="没有更多了"
                      @load="onLoad">
              <van-cell v-for="articleItem in channelsItem.articles"
                        :key="articleItem.art_id"
                        :title="articleItem.title" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <HomeChannel v-model="ischannelshow"
                 :channels="channels"
                 :activeIndex="activeChannelIndex" />
  </div>
</template>

<script>
import { getUserChannels } from '../../api/channel'
import { getArticles } from '../../api/article'
import HomeChannel from './components/channel'
export default {
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      channels: [],
      ischannelshow: false
    }
  },
  watch: {
    async  '$store.state.user' () {
      this.loadchannels()
      this.activeChannel.upPullLoading = true
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  created () {
    this.loadchannels()
  },
  methods: {
    async onLoad () {
      let data = []
      data = await this.loadArticles()
      // 如果没有 pre_timestamp 并且数组时空的，则意味这没有数据了
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据加载完毕，组件会自动给出提示，并且不再onload
        this.activeChannel.upPullFinished = true
        // 取消loading
        this.activeChannel.upPullLoading = false
        // 不往后执行
        return
      }

      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        // 加载下一页数据
        data = await this.loadArticles()
      }
      // 数据加载好以后，将pre_timestamp更新到当前频道的中用于加载下下页数据
      this.activeChannel.timestamp = data.pre_timestamp
      // 将文章数据更新到频道数据中
      this.activeChannel.articles.push(...data.results)
      // 数据加载完成取消上拉loading
      this.activeChannel.upPullLoading = false
    },
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp
      // 使用最新时间戳区请求最新的推荐数据
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文件中
        activeChannel.articles = data.results
        // 由于你重置的文章列表，那么当前数据中的Pre_timestamp就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        // 提示信息
        activeChannel.downPullSuccessText = '更新成功'
        // 当下拉刷新有数据并重置以后数据无法满足一屏，所以我们使用onload在多加载一页数据
        this.onLoad()
      } else {
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 下拉结束取消loading状态
      activeChannel.downPullLoading = false
      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },
    async loadchannels () {
      const { user } = this.$store.state

      let channels = []

      // 已登录
      if (user) {
        const data = await getUserChannels()
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
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })

      this.channels = channels
    },
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId,
        timestamp,
        withTop: 1
      })
      return data
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
.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right: 0;
  background-color: #fff;
}
</style>
