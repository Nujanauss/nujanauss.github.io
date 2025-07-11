function [choiceProbs,params] = softmaxChoiceRule(params)
    params = kalmanUpdate(params);
    beta = params.beta;
    means = params.means;

    e = exp(beta * means);
    choiceProbs = e / sum(e);
end
