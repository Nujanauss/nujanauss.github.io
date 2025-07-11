function [choiceProbs,params] = winStayLoseSwitchChoiceRule(params)
    previousSelection = params.previousSelection(end);
    previousReward = params.previousReward(end);
    epsilon = params.epsilon;
    repeatThreshold = params.repeatThreshold;
    
    choiceProbs = ones(4, 1) * epsilon;
    if previousReward > repeatThreshold
        choiceProbs(previousSelection) = 1 - 3 * epsilon;
    else
        choiceProbs(setdiff(1:end,previousSelection)) =  (1 - epsilon) / 3;
    end
end