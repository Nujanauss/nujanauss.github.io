function [choiceProbs,params] = epsilonGreedyChoiceRule(params)
    params = kalmanUpdate(params);
    epsilon = params.epsilon;
    means = params.means;

    if length(unique(means)) > 1
        choiceProbs = ones(4,1) * epsilon;
        [~,argmax] = max(means);
        choiceProbs(argmax) = 1 - 3 * epsilon;
    else
        choiceProbs = ones(4,1) * 0.25;
    end
end
