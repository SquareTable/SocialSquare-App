export const getTimeFromUTCMS = (ms) => {
    //This function calculates the difference between the current time and the UTC milliseconds time provided to the function as oldTime
    //This function outputs seconds, minutes, hours, days, weeks, months (calculated as 31 days), and years (calculated as 365 days)
    const currentTime = Date.now()
    const millisecondDifference = currentTime - ms
    const secondsDifference = Math.floor(millisecondDifference / 1000)
    const minutesDifference = Math.floor(secondsDifference / 60)
    const hoursDifference = Math.floor(minutesDifference / 60)
    const daysDifference = Math.floor(hoursDifference / 24)
    const weeksDifference = Math.floor(daysDifference / 7)
    const monthsDifference = Math.floor(daysDifference / 31)
    const yearsDifference = Math.floor(daysDifference / 365)

    return yearsDifference > 0 ? `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'} ago` : 
    monthsDifference > 0 ? `${monthsDifference} ${monthsDifference === 1 ? 'month' : 'months'} ago` :
    weeksDifference > 0 ? `${weeksDifference} ${weeksDifference === 1 ? 'week' : 'weeks'} ago` :
    daysDifference > 0 ? `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago` :
    hoursDifference > 0 ? `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago` :
    minutesDifference > 0 ? `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago` :
    secondsDifference > 0 ? `${secondsDifference} ${secondsDifference === 1 ? 'second' : 'seconds'} ago` :
    'Just Now'
}