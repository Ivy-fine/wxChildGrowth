// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
function getChild(user_id){
  return db.collection('children').where({
    user_id
  }).get()
}
function addChild(user_id,child){
  return db.collection('children').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      user_id,
      ...child
    }
  })
}
exports.main = async (event, context) => {
  const {child,user_id} = event;
  const result = child ? await addChild(user_id, child) : await getChild(user_id)
  return {
    result
  }
}