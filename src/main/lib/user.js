const User = require('../models/User')
const is_whitelisted = async (linkblue_username) => {
    //REFERENCE: https://uk.instructure.com/courses/1957194/discussion_topics/12306872
    //This pulls the user from the user table and puts the linkblueusername
    const user = await User.query()
	    .findById(linkblue_username)
    //if the user matches
    if (user) {
        //return true
        return true
    }
    //else
    else {
        //return false
        return false
    }
}

//This makes the whitelist public
module.exports.is_whitelisted = is_whitelisted

  //TASK: Check if the username matches the ones in the whitelist
  //Edited by: Jeremy Farmer
  //Viewed by: This code looks fine. It appears to check if a given linkblue is in a whitelist or not.
