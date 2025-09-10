import Airtable from 'airtable'

const token =
  'patT9Cm2slZzZJRXi.5958359359d08413f98fcaad2979332431a7772514576341ce44dd05537f2267'

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: token
})

const base = Airtable.base('appeGI9OIJnbCsHxv')

function getPostTeasers() {
  return new Promise((resolve, reject) => {
    const content = []

    base('ExtraWeb')
      .select({ maxRecords: 100 })
      .firstPage()
      .then((records) => {
        records.forEach((record) => {
          content.push({
            id: record.id,
            title: record.fields['title'] || '',
            description: record.fields['description'] || '',
            link: record.fields['link'] || '',
            light: record.fields['light']?.name === 'true',

            background: record.fields['backround']?.[0]?.url || '',
            extras: record.fields['images']?.map((img) => img.url) || []
          })
        })

        resolve(content)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { getPostTeasers }
