const StartAndEndTime = ( stationsInfo ) => {
    // const sessionData = JSON.parse(sessionStorage.getItem("data"));
    // const { stationData } = sessionData ? sessionData : {};
    const times = [];

    stationsInfo.map(station => {
        if (station.SurveyTime) {
            const toLocale = new Date(station.SurveyTime).toLocaleString('en-US', { timeZone: 'Atlantic/Canary' })
            const adjustForTimeZone = new Date(toLocale).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
            times.push(adjustForTimeZone)
        };
    });

    const sorted = times.sort((a, b) => a.localeCompare(b));
    const final = [sorted[0], sorted[sorted.length - 1]];
    return final;
}

export default StartAndEndTime