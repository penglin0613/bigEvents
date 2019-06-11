module.exports = {
  cExist(data) {
    // 不存在
    if (data===undefined ||data===null) {
      return false
    }
    if (data.trim()==='') {
      return false
    }
    return true
  },
  cNum(data) {
    // 如果不是数字
    if (isNaN(data)==true) {
      return false
    }
    return true
  }
}
