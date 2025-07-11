function [choiceProbs,params] = socialSoftmaxChoiceRule(params)
    params = kalmanUpdate(params);
    comparisonViewedByParticipant = getComparison(params);

    betaInt = params.betaInt;
    addition = 0;
    if comparisonViewedByParticipant ~= 0
        lastFiveRewards = sum(getComparisonRewards(params));
        addition = params.betaSlop * (comparisonViewedByParticipant / params.comparisonFrequency - lastFiveRewards / params.comparisonFrequency);
    end
    means = params.means;

    beta = betaInt + addition;
    if beta < 0
        beta = 0;
    end
    e = exp(beta * means);
    choiceProbs = e / sum(e);
end
