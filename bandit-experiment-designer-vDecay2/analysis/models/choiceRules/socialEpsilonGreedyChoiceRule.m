function [choiceProbs,params] = socialEpsilonGreedyChoiceRule(params)
    params = kalmanUpdate(params);
    comparisonViewedByParticipant = getComparison(params);

    epsilonInt = params.epsilonInt;
    addition = 0;
    if comparisonViewedByParticipant ~= 0
        lastFiveRewards = sum(getComparisonRewards(params));
        diff = (comparisonViewedByParticipant / params.comparisonFrequency - lastFiveRewards / params.comparisonFrequency);
        addition = params.epsilonSlop * diff;
    end
    epsilon = epsilonInt + addition;
    epsilon = .25 / (1 + exp(-10 * epsilon)); % to reduce chance of getting to 0.25

    means = params.means;
    if length(unique(means)) > 1
        choiceProbs = ones(4,1) * epsilon;
        [~,argmax] = max(means);
        choiceProbs(argmax) = 1 - 3 * epsilon;
    else
        choiceProbs = ones(4,1) * 0.25;
    end
end
