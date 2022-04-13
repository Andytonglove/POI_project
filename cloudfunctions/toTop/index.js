const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  if(event.cnt==0){
    try {
      return await db.collection('message').doc(event.id).update({
        data: {
          top: true,
        },
      })
    } catch (e) {
      console.error(e)
    }
  }else{
    try {
      return await db.collection('message').doc(event.id).update({
        data: {
          top: false
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

}