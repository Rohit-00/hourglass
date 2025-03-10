export function timeDifference(startTime: string, endTime: string): string {
    const startDate = parseTime(startTime);
    const endDate = parseTime(endTime);

    if (!startDate || !endDate) {
        return "Invalid time format";
    }

    let diffMs = endDate.getTime() - startDate.getTime();

    // If the difference is negative, it means endTime is on the next day
    if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
}

function parseTime(timeStr: string): Date | null {
    const parsedDate = new Date();
    
    // Ensure input matches expected format (e.g., "10:00 PM" or "9:30 AM")
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

    if (!match) return null;

    let [, hours, minutes, period] = match;
    let hour = parseInt(hours, 10);
    let minute = parseInt(minutes, 10);

    // Convert 12-hour format to 24-hour format
    if (period.toUpperCase() === "PM" && hour !== 12) {
        hour += 12;
    } else if (period.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
    }

    parsedDate.setHours(hour, minute, 0, 0);
    return parsedDate;
}

export function convertTimeDifferenceToNumber(timeDiff: string): number {
    const match = timeDiff.match(/(\d+)\s*h?\s*(\d*)\s*m?/i);
    
    if (!match) return NaN;

    const hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;

    // Convert minutes into decimal (e.g., 12 minutes → 0.2)
    const decimalMinutes = minutes / 60;

    return parseFloat((hours + decimalMinutes).toFixed(2));
}

export function getPercentage(wakeupTime:string,bedtime:string){
    const totalWorkingTime = convertTimeDifferenceToNumber(timeDifference(wakeupTime,bedtime))

    const now = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    }).replace(/^0/, '');

    const nowDiff = convertTimeDifferenceToNumber(timeDifference(now,bedtime))

    return (Math.abs((nowDiff/totalWorkingTime)*100-100))

}



export function convertToTimeDuration(hours: number): string {
    // if (hours < 0) throw new Error("Time cannot be negative");
  
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
  
    let result = "";
    if (wholeHours > 0) {
      result += `${wholeHours}h `;
    }
    if (minutes > 0 || wholeHours === 0) {
      result += `${minutes}m`;
    }
  
    return result.trim();
  }

  export const calcWeek = () => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today;
  };
  
  // Calculate this month's first date
  export const getFirstThisMonth = () => {
    const today = new Date();
    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDateOfMonth;
  };
  
  // Calculate previous month's first date
  export const getFirstLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return lastMonth;
  };
  
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

export const formattedToday = `${month}/${day}/${year}`;
export const formattedYesterday = `${month}/${day-1}/${year}`;
