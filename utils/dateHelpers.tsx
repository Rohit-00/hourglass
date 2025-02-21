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
export function convertTimeToDate(timeString: string): Date {
    const [time, modifier] = timeString.split(" "); 
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    } else if (modifier === "AM" && hours === 12) {
        hours = 0;
    }
    
    const date: Date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
}

function formatTimeDifference(minutes: number): string {
    const hours: number = Math.floor(minutes / 60);
    const mins: number = minutes % 60;
    return `${hours} hours ${mins} minutes`;
}


