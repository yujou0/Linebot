// 引用line機器人套件
import linebot from 'linebot'
// 引用dotenv機器人套件
import dotenv from 'dotenv'
// 讀取json資料
import json from './aed資料.js'

const distance = (lat1, lon1, lat2, lon2, unit) => {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0
  } else {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }
}

// 讀取.env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  try {
    let reply = []
    const lat = event.message.latitude
    const lng = event.message.longitude
    for (const data of json) {
      const dis = distance(data.地點LAT, data.地點LNG, lat, lng, 'K')
      if (dis <= 0.5) {
        let str = ''
        // for (let i = 0; i <= str.length; i++) {
        str += '🏘' + `${data.場所名稱}` + '🏘'
        //   if (i >= 8) { break }
        // }
        // str += `${data.場所名稱}`
        reply.push('您好，以下為直線距離500公尺內接近您的AED地點名稱:\n ' + str + ' \n(最多只列5項)，詳細地圖及資訊"請輸入 AED地點名稱"查詢(地點名稱需完全相同)')
        if (reply.length >= 5) break
      } else if (event.message.text === data.場所名稱) {
        reply.push(
          {
            type: 'location',
            title: `${data.場所名稱}`,
            address: ` ${data.場所地址} `,
            latitude: data.地點LAT,
            longitude: data.地點LNG
          },
          {
            type: 'text',
            text: `🏥AED放置地點: ${data.AED放置地點}
🛎是否全年全天開放大眾使用: ${data.全年全天開放大眾使用}
⏱開放使用時間:
周一至周五 ${data.周一至周五起}~${data.周一至周五迄}
周六 ${data.周六起}~${data.周六迄}
周日 ${data.周日起}~${data.周日迄}
📞連絡電話:
${data.開放時間緊急連絡電話}`,
            weight: 'bold',
            size: 'xs'
          }

        )
      } else if (event.message.text === 'AED使用方法') {
        reply.push(
          {
            type: 'image',
            originalContentUrl: 'https://www.sanxia.police.ntpc.gov.tw/Public/Images/201912/3651912251828d6d27.jpg',
            previewImageUrl: 'https://www.sanxia.police.ntpc.gov.tw/Public/Images/201912/3651912251828d6d27.jpg'
          },
          {
            type: 'text',
            text: `📢自動體外電擊去顫器AED使用步驟如下：
 ① 步驟一：打開電源開關。 語音指示系統將啟動，聽指示進行以下步驟。
 ② 步驟二：貼上電擊片，插入導線。右側電擊片，置於胸骨右上緣，鎖骨下方；左側電擊片，置於左乳頭外側，其上緣距離左腋窩下約7公分。若患者流汗時，貼上電擊片前，必須用乾布或毛巾將潮濕的胸部擦乾。
 ③ 步驟三：自動分析心律。為避免判讀錯誤，分析心律時，避免接觸及晃動病患。分析心律約需5至15秒鐘，全視AED機型而定。 
 ④ 步驟四：確定無人接觸病患，依機器指示電擊。電擊前警告所有旁人及救援者，「我離開，你離開，大家都離開！」並檢視確定無人接觸患者後，再按下電擊鈕。`,
            weight: 'bold',
            size: 'xs'
          }

        )
        break
      } else if (event.message.text === 'AED使用時機') {
        reply.push(
          {
            type: 'image',
            originalContentUrl: 'https://aide-56b9e.firebaseapp.com/images/AED/kl_AED.jpg',
            previewImageUrl: 'https://aide-56b9e.firebaseapp.com/images/AED/kl_AED.jpg'
          },
          {
            type: 'text',
            text: '當患者沒有意識，沒有呼吸，也沒有脈搏時，就可以使用 AED。',
            weight: 'bold',
            size: 'xs'
          }

        )
        break
      } else if (event.message.text === '何謂AED?') {
        reply.push(
          {
            type: 'image',
            originalContentUrl: 'https://tw-aed.mohw.gov.tw/UploadContent/AED_logo.jpg',
            previewImageUrl: 'https://tw-aed.mohw.gov.tw/UploadContent/AED_logo.jpg'
          },
          {
            type: 'text',
            text: '⭐⭐⭐AED 是 Automated External Defibrillators 的縮寫，中文為「自動體外心臟除顫器」。也有人稱為「自動體外心臟去顫器」、「傻瓜電擊器」。',
            weight: 'bold',
            size: 'xs'
          }

        )
        break
      } else if (event.message.text === 'line機器人使用說明') {
        reply.push(
          {
            type: 'text',
            text: `⒈ 🏥查詢附近500公尺內AED設備:按左下角 "＋"，點擊位置資訊公開所在位置，LINE機器人會回傳距離您500公尺內的"AED地點名稱"

⒉ 💬查詢該地點的詳細聯絡資料:輸入"AED地點名稱"(注意地點名稱需完全相同)，機器人即回傳該地點的詳細資訊(ex:明志科技大學)

⒊ 📋使用功能列表，輸入文字 "功能" ，即會顯示功能列表`,
            weight: 'bold',
            size: 'xs'
          }

        )
        break
      } else if (event.message.text === '功能') {
        reply = {
          type: 'flex',
          altText: 'Q1. Which is the API to create chatbot?',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '功能列表',
                      align: 'center',
                      size: 'xxl',
                      weight: 'bold'
                    },
                    {
                      type: 'text',
                      text: '請點選以下選項選用功能',
                      wrap: true,
                      weight: 'bold',
                      margin: 'lg'
                    }
                  ]
                },
                {
                  type: 'separator'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: '1.',
                          flex: 1,
                          size: 'lg',
                          weight: 'bold',
                          color: '#666666'
                        },
                        {
                          type: 'text',
                          text: '何謂AED?',
                          wrap: true,
                          flex: 9
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: '2.',
                          flex: 1,
                          size: 'lg',
                          weight: 'bold',
                          color: '#666666'
                        },
                        {
                          type: 'text',
                          text: 'AED使用方法',
                          wrap: true,
                          flex: 9
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: '3.',
                          flex: 1,
                          size: 'lg',
                          weight: 'bold',
                          color: '#666666'
                        },
                        {
                          type: 'text',
                          text: 'AED使用時機',
                          wrap: true,
                          flex: 9
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: '4.',
                          flex: 1,
                          size: 'lg',
                          weight: 'bold',
                          color: '#666666'
                        },
                        {
                          type: 'text',
                          text: 'line機器人使用說明',
                          wrap: true,
                          flex: 9
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'horizontal',
              spacing: 'sm',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: '1',
                    text: '何謂AED?'
                  }
                },
                {
                  type: 'button',
                  style: 'primary',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: '2',
                    text: 'AED使用方法'
                  }
                },
                {
                  type: 'button',
                  style: 'primary',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: '3',
                    text: 'AED使用時機'
                  }
                },
                {
                  type: 'button',
                  style: 'primary',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: '4',
                    text: 'line機器人使用說明'
                  }
                }
              ]
            }
          }

        }
        break
      }
    }

    reply = (reply.length === 0) ? '輸入有誤，請重新傳送位置資訊。可以輸入"功能"，點擊"LINE機器人使用說明"查看使用教學。' : reply
    console.log(reply)
    event.reply(reply)
  } catch (error) {
    event.reply('發現錯誤')
    console.log(error)
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
