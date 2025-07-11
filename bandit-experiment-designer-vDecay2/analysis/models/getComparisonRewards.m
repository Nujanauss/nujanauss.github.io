function rewards = getComparisonRewards(params)
    r = params.previousReward;
    trial = length(r);
    rewards = r(trial-(params.comparisonFrequency-1):trial);
end