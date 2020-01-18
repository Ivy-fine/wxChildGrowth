const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果


const getReportKey = (value, data) => {
  let key = 0;
  switch (true) {
    case value < data[2]:
      key = 0;
      break;
    case value >= data[2] && value < data[3]:
      key = 1;
      break;
    case value >= data[3] && value < data[5]:
      key = 2;
      break;
    case value >= data[5] && value < data[7]:
      key = 3;
      break;
    case value >= data[7] && value < data[8]:
      key = 4;
      break;
    default:
      key = 5;
      break;
  }
  return key;
};

function getReport(record, child, type,report,data) {
  let result = {};
  let age =
    record.days * 1 > 1856
      ? Math.floor((record.days * 1) / 30)
      : record.days * 1;
  let reportKey = 0;
  let value = type === "bmi" ? record.bmi : record.nowHeight;
  let average = "";
  let gender = child.gender === "0" ? "girl" : "boy";
  if (record.days * 1 > 1856) {
    reportKey = getReportKey(value, data[gender][type][1][age]);
    average = data[gender][type][1][age][5];
  } else {
    reportKey = getReportKey(value, data[gender][type][0][age]);
    average = data[gender][type][0][age][5];
  }
  if (record.days <= 1856) {
    result =
      type === "bmi"
        ? report.weight.day[reportKey]
        : report.height.day[reportKey];
  } else {
    result =
      type === "bmi"
        ? report.weight.months[reportKey]
        : report.height.months[reportKey];
  }
  result.weight = record.nowWeight;
  result.nowHeight = record.nowHeight;
  result.nowWeight = record.nowWeight;
  result.heredity = child.heredity;
  result["average" + type] = average;
  return result;
}

async function getChild(cid){
  const data = await db.collection('children').where({
    _id:cid
  }).get()
  return data.data[0];
}
async function getRecord(rid) {
  const data = await db.collection('record').where({
    _id: rid
  }).get()
  return data.data[0];
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { type,rid,cid} = event;
  const growth_data = await db.collection('growth_data').get()
  const report = await db.collection('report').get()
  const child = await getChild(cid)
  const record = await getRecord(rid)
  return getReport(record, child, type, report.data[0], growth_data.data[0]);
}
