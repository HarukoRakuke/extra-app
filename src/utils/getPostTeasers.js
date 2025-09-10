import Airtable from 'airtable'

// ⚠️ Вынеси токен в .env, не храни в коде
const token = 'patT9Cm2slZzZJRXi.5958359359d08413f98fcaad2979332431a7772514576341ce44dd05537f2267'


Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: token
})

const base = Airtable.base('appeGI9OIJnbCsHxv')

function normalizeExtrasFromImages(images = []) {
  return images
    .filter(Boolean)
    .map((file) => {
      const url = file.url
      const mime = file.type || ''
      const isVideoByMime = mime.startsWith('video/')
      const isVideoByExt = /\.(mp4|webm|ogg)$/i.test(url)
      const isVideo = isVideoByMime || isVideoByExt

      return {
        type: isVideo ? 'video' : 'image',
        url
      }
    })
}

function getPostTeasers() {
  return new Promise((resolve, reject) => {
    const content = []

    base('ExtraWeb')
      .select({ maxRecords: 100 })
      .firstPage()
      .then((records) => {
        records.forEach((record) => {
          const f = record.fields || {}
          const images = f['images'] || [] // одно поле для всего

          content.push({
            id: record.id,
            title: f['title'] || '',
            description: f['description'] || '',
            link: f['link'] || '',
            light: f['light']?.name === 'true',
            tag: f['tags'] || '',
            background: f['backround']?.[0]?.url || '',
            extras: normalizeExtrasFromImages(images) // [{type,url}]
          })
        })
        resolve(content)
      })
      .catch(reject)
  })
}

export { getPostTeasers }
