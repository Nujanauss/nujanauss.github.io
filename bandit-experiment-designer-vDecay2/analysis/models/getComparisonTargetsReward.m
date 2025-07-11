function comparisonForTrial = getComparisonTargetsReward(params,rewardsArray,trial)
    upwardPercentage = params.upwardComparisonPercentage;
    availableRewards = rewardsArray(trial,:);
    if rand() < upwardPercentage
        greaterRewards = availableRewards(availableRewards > params.previousReward(end));
        if ~isempty(greaterRewards)
            comparisonForTrial = rndElementFromArray(greaterRewards);
            return
        end
    else
        lessOrEqualRewards = availableRewards(availableRewards <= params.previousReward(end));
        if ~isempty(lessOrEqualRewards)
            comparisonForTrial = rndElementFromArray(lessOrEqualRewards);
            return
        end
    end
    comparisonForTrial = rndElementFromArray(availableRewards);
end

function x = rndElementFromArray(A)
    x = A(randi(length(A),1));
end