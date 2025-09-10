import { TOPIC_OF_DAY } from '../constants/filters'

export function getTopicOfDayId() {
  const d = new Date()
  const weekday = d.getDay() // 0–6
  return TOPIC_OF_DAY[weekday] || null
}
