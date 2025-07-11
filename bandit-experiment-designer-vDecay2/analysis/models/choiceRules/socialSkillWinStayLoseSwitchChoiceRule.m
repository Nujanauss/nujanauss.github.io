function [choiceProbs,params] = socialSkillWinStayLoseSwitchChoiceRule(params)
    comparisonViewedByParticipant = getComparison(params);

    previousSelection = params.previousSelection(end);
    previousReward = params.previousReward(end);
    epsilon = params.epsilon;
    repeatThreshold = params.repeatThreshold;

    if comparisonViewedByParticipant ~= 0
        lastFiveRewards = sum(getComparisonRewards(params));
        params.skill = params.skill + params.alphaSkill * (comparisonViewedByParticipant / params.comparisonFrequency - lastFiveRewards / params.comparisonFrequency);
        tau = params.skill * params.tau;
    else
        tau = 0;
    end

    params.repeatThreshold = repeatThreshold + tau * (comparisonViewedByParticipant / params.comparisonFrequency - repeatThreshold);
    choiceProbs = ones(4, 1) * epsilon;
    if previousReward > params.repeatThreshold
        choiceProbs(previousSelection) = 1 - 3 * epsilon;
    else
        choiceProbs(setdiff(1:end,previousSelection)) =  (1 - epsilon) / 3;
    end
end
