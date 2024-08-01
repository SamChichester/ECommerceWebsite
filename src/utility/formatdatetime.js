const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

export default formatDateTime;