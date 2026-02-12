const { parse } = require("dotenv");

module.exports = {
    format_date: (date) => {
        if(!date) return '';
        // Format date as MM/DD/YYYY
        return new Date(date).toLocaleDateString();
    },
    format_time: (time) => {
        // Format time as HH:MM AM/PM
        if(!time) return '';
        const parts = time.split(':');
        let hours = parseInt(parts[0]);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12;
        hours = hours ? hours : 12; 
        return `${hours}:${minutes} ${ampm}`;
    
    },
    eq: (a, b) => a === b,
};
