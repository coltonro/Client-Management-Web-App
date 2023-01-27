
export const breedingSurvey = (propertyName, countyName, dateSurveyed, birder, acreage, numOfStations, startTime, endTime) => {
    // const editedStartTime = startTime.slice(0, 5);
    // const editedEndTime = endTime.slice(0, 5);

    return `A breeding bird survey was conducted on the ${propertyName} property in ${countyName} County on the morning of ${dateSurveyed}. ${birder}, biologist for Plateau Land and Wildlife, conducted the survey. The protocol for the survey was to re-survey or establish stations throughout the ${acreage} acre ranch at 250 meter (.15 mile) or greater intervals. Observations, both visual and auditory, were taken at each station for periods lasting three minutes. We observed ${numOfStations} station(s) during this survey. The survey began at ${startTime} and ended at ${endTime }. Weather conditions were noted at the beginning and end of the survey.`
};

export const springSecondParagraph = (property) => {
    return `An annual survey using the same stations will be conducted on the property during the breeding season (mid March - late June), between 0600 and 1100 hours. These surveys will be helpful in determining trends in population changes of the breeding birds on the subject property. This information could be useful in targeting and/or maintaining management activities with regards to breeding birds found on the ${property} property.`
};

export const summerSurvey = (propertyName, countyName, dateSurveyed, birder, acreage, numOfStations, startTime, endTime) => {
    return `A summer songbird survey was conducted on the ${propertyName} property in ${countyName} County on the morning of ${dateSurveyed}. ${birder}, biologist for Plateau Land and Wildlife, conducted the survey. The protocol for the survey was to re-survey or establish stations throughout the ${acreage} acre ranch at 250 meter (.15 mile) or greater intervals. Observations, both visual and auditory, were taken at each station for periods lasting three minutes. We observed ${numOfStations} station(s) during this survey. The survey began at ${startTime} and ended at ${endTime}. Weather conditions were noted at the beginning and end of the survey.`
};

export const summerSecondParagraph = (property) => {
    return `An annual survey using the same stations will be conducted on the property during the summer months (July - September), between 0600 and 1100 hours. These surveys will be helpful in determining trends in population changes of the breeding birds on the subject property. This information could be useful in targeting and/or maintaining management activities with regards to breeding birds found on the ${property} property.`
}

export const fallSurvey = (propertyName, countyName, dateSurveyed, birder, acreage, numOfStations, startTime, endTime) => {
    return `A fall songbird survey was conducted on the ${propertyName} property in ${countyName} County on the morning of ${dateSurveyed}. ${birder}, biologist for Plateau Land and Wildlife, conducted the survey. The protocol for the survey was to re-survey or establish stations throughout the ${acreage} acre ranch at 250 meter (.15 mile) or greater intervals. Observations, both visual and auditory, were taken at each station for periods lasting three minutes. We observed ${numOfStations} station(s) during this survey. The survey began at ${startTime} and ended at ${endTime}. Weather conditions were noted at the beginning and end of the survey.`
};

export const winterSurvey = (propertyName, countyName, dateSurveyed, birder, acreage, numOfStations, startTime, endTime) => {
    return `A winter-resident bird survey was conducted on the ${propertyName} property in ${countyName} County on the morning of ${dateSurveyed}. ${birder}, biologist for Plateau Land and Wildlife, conducted the survey. The protocol for the survey was to re-survey or establish stations throughout the ${acreage} acre ranch at 250 meter (.15 mile) or greater intervals. Observations, both visual and auditory, were taken at each station for periods lasting five minutes. We observed ${numOfStations} station(s) during this survey. The survey began at ${startTime} and ended at ${endTime}. Weather conditions were noted at the beginning and end of the survey.`
};

export const fallWinterSecondParagraph = "Avian communities in Texas change over the course of the year as migrants to the area arrive and then return to their seasonal homes. Understanding which bird species are using the property throughout the year is important for a landowner's wildlife management program. It is this understanding which helps a landowner make critical decisions regarding habitat modification and protection. In addition, many bird species are only found in Texas during the winter months and thus, are not documented during the spring and summer."

export const thirdParagraph = 'A brief description of each station, beginning and ending survey times and weather conditions, and a list of bird observations are as follows.';