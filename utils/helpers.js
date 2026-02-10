module.exports = {
    format_date: (date) => {
        // Format date as MM/DD/YYYY
        return date.toLocaleDateString();
    },
    format_time: (time) => {
        // Format time as HH:MM AM/PM
        if(!time) return '';

        const date = new Date(`1970-01-01T${time}Z`);

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    eq: (a, b) => a === b,
};
