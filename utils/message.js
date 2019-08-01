const {  validationResult } = require("express-validator")

module.exports = {
  errorMsg: (req, res, next) => {
    const valRes = validationResult(req)
    if (!valRes.isEmpty()) {
      let msg = ""
      valRes.errors.forEach(v => {
        msg += `${v.param},`
      })
      msg = msg.slice(0, -1)
      msg += " 参数有问题,请检查"
      return res.status(400).send({
        msg
      })
    }
    next()
  }
}
