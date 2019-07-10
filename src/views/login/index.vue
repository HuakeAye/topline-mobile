<template>
  <div>
    <van-nav-bar title="标题" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   required
                   left-icon="user-o"
                   label="手机号"
                   placeholder="请输入手机号" />

        <van-field v-model="user.code"
                   type="password"
                   label="密码"
                   left-icon="eye-o"
                   placeholder="请输入密码"
                   required />
      </van-cell-group>
      <div class="login-btn">
        <van-button class="btn"
                    type="info"
                    @click="handlelogin">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/article'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async handlelogin () {
      try {
        const data = await login(this.user)
        console.log(data)
        console.log('登录成功')
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
    }
  }
}
</script>

<style lang="less" scope>
.login-btn {
  padding: 10px;
  .btn {
    width: 100%;
  }
}
</style>
