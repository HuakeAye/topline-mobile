<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页"
                   fixed />
      <van-tabs class="channel-tabs"
                v-model="activeChannelIndex">
        <van-tab title="标签 1">
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
export default {
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      downPullLoading: false
    }
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
