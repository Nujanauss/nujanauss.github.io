function [choiceProbs,params] = perseveratingSoftmaxChoiceRule(params)
    params = kalmanUpdate(params);
    params.cValues = updateCValues(params);
    
    means = params.means;
    beta = params.beta;
    betaC = params.betaC;
    cValues = params.cValues;

    e = exp(beta * means + betaC * cValues);
    choiceProbs = e / sum(e);
end
