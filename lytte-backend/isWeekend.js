
function isWeekend() {
    const today = new Date();
    const day = today.getDay();
    
    // return day === 0 || day === 6;
    // return true;
    return false;
}

export default isWeekend;
