function [choiceProbs,params] = socialDirectedSoftmaxChoiceRule(params)
    params = kalmanUpdate(params);
    comparisonViewedByParticipant = getComparison(params);

    omegaInt = params.omegaInt;
    addition = 0;
    if comparisonViewedByParticipant ~= 0
        lastFiveRewards = sum(getComparisonRewards(params));
        addition = params.omegaSlop * (comparisonViewedByParticipant / params.comparisonFrequency - lastFiveRewards / params.comparisonFrequency);
    end

    beta = params.beta;
    omega = omegaInt + addition;
    means = params.means;
    variances = params.variances;

    e = exp(beta * (means + omega * sqrt(variances)));
    choiceProbs = e / sum(e);
end
