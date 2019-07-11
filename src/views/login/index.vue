<template>
  <div>
    <van-nav-bar title="登录" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   v-validate="'required'"
                   name="mobile"
                   :error-message="errors.first('mobile')"
                   required
                   clearable
                   left-icon="user-o"
                   label="手机号"
                   placeholder="请输入手机号" />

        <van-field v-model="user.code"
                   type="code"
                   v-validate="'required'"
                   name="code"
                   :error-message="errors.first('code')"
                   label="验证码"
                   left-icon="eye-o"
                   placeholder="请输入验证码"
                   required />
      </van-cell-group>
      <div class="login-btn">
        <van-button class="btn"
                    type="info"
                    @click.prevent="handlelogin">登录</van-button>
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
        mobile: '18330606912',
        code: '246810'
      }
    }
  },
  created () {
    this.configCustomMessages()
  },
  methods: {
    async handlelogin () {
      try {
        const valid = await this.$validator.validate()
        console.log(valid)
        if (!valid) {
          return
        }
        const data = await login(this.user)
        this.$store.commit('saveUser', data)
        this.$router.push({ name: 'home' })
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败')
      }
    },
    configCustomMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
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
