import request from '@/utils/requst'

export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取所用频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

export const resetUserChannels = channels => {
  return request({
    method: 'PUT',
    url: `/app/v1_0/user/channels`,
    data: {
      channels
    }
  })
}
