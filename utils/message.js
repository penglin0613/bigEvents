module.exports = {
  invalidParameter(res, parName, msg = '参数无效，请检查') {
    res.send({
      msg: `${parName} ${msg}'`,
      code: 400
    })
  }
}
