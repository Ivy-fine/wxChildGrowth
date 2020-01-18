// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
function getRecord(child_id) {
  return db.collection('record').where({
    child_id
  }).get()
}
function addRecord(child_id, record) {
  return db.collection('record').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      child_id,
      ...record
    }
  })
}
function updateRecord(child_id,record){
  return db.collection('record').where({
    child_id
  }).update({
    data:{
      ...record
    }
  })
}
exports.main = async (event, context) => {
  const { action, record, child_id } = event;
  let result;
  switch(action){
    case "getRecord":
      result = await getRecord(child_id);
      break;
    case "addRecord":
      result = await addRecord(child_id,record);
      break;
    case "updateRecord":
      result = await updateRecord(child_id,record);
      break;
    default:
      result = {}
      break;
  }
  return {
    result,
    event
  }
}