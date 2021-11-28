
// milliseconds to days, hours, minutes, seconds
export const getTimeLeft = (endTime) => {
  const now = new Date()
  const diff = endTime - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
  const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
  
  let output = `${hours}:${minutes}:${seconds}`

  if (days > 0) output = `${days}d ${output}`
  if (diff < 0) output = '00:00:00'

  return output
}