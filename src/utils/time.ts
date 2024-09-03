// 封装一个函数，获取当前所处时间段
export const get_cur_time = () => {
  let cur_hour = new Date().getHours()
  let message = ''
  if (cur_hour < 11) {
    message = '上午好'
  } else if (cur_hour < 14) {
    message = '中午好'
  } else if (cur_hour < 18) {
    message = '下午好'
  } else if (cur_hour <= 23) {
    message = '晚上好'
  }
  return message
}
