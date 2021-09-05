var fs = require('fs');

const PERCENT_DP = 4;

// Helper function to write files
// data: data to be written to file
// name: the name the file wwill have (exlcuding file type extension as this is prepended automatically)
// isJson: boolean flag for json files, otherwise assumed to be text files
function write_file(data, name, isJson) {
    const extension = isJson ? "json" : "txt"
    if (isJson) {
        data = JSON.stringify(data);
    }
    
    fs.writeFile(`${name}.${extension}`, data, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function setup(rewardsConfig, config) {
    // Update count for mystery prizes
    rewardsConfig.standard['Mystery prize'].count = rewardsConfig.mystery.length;
            
    // Reset the event multiplier
    config.multiplier = 1; 
    // Set the event multipler display to blank
    write_file("", "event_multiplier_display", false);

    if (config.isEvent) {
        // Setup multiplier
        
        // Add event pulls into standard roster
        for (let name in rewardsConfig.event) {
            rewardsConfig.standard[name] = rewardsConfig.event[name];
        }   
    }

    // Reset reward output file with "slots!" default
    write_file("Slots!", "drawn_reward_display", false);

    return [rewardsConfig, config]
}

function getRewardList(rewardsConfig) {
    
    let totalCount = 0; 
    for (let name in rewardsConfig.standard) {
        totalCount += rewardsConfig.standard[name].count * rewardsConfig.standard[name].weight;
    }

    let rewardsList = []
    for (let name in rewardsConfig.standard) {
        // Get percent chance to roll given reward
        // NB: Percent is stored as float (ie for 90% 0.9 etc)
        let rawPercent = (rewardsConfig.standard[name].count * rewardsConfig.standard[name].weight) / totalCount;
        // Round to 4dp
        let clean_percent = Math.round(rawPercent * 10**PERCENT_DP) / 10**PERCENT_DP;
        // Add reward and percent to list of rewards
        rewardsList.push({"name": name, "percent" : clean_percent})
    }

    return rewardsList
}

function makeRewardDispaly(rewardsList) {
    rewardsList = rewardsList.sort(function(a, b) {
        return b.percent - a.percent;
    });
    
    rewardDisplayString = ""
    for (let reward of rewardsList) {
        if (reward.percent < 0.1) {
            rewardDisplayString += " " // Helps the numbers align nicely :)
        }
        rewardDisplayString += `${(reward.percent * 100).toFixed(2)}% : ${reward.name}\n`
    }
    
    write_file(rewardDisplayString.trim(), "rewards_display", false)
}

function main() {
    // Fetch config files
    var rewardsConfig = require('./rewards_config.json');
    var config = require('./config.json');
    // TODO: catch if they exist

    // Initial setup and resets generated text files for displays
    //      Event config is handeled here
    //          If event mode, it adds the event rewards to the normal roster
    [rewardsConfig, config] = setup(rewardsConfig, config);
    
    // Create live data file for rewards
    write_file(rewardsConfig, "rewards_live_data", true);

    // Calculates percent chances for each reward returns a list containing each reward and its percent chance
    let rewardsList = getRewardList(rewardsConfig);

    // Generates the display file for current rewards
    makeRewardDispaly(rewardsList)
}

main();