function [choiceProbs,params] = perseverationChoiceRule(params)
    params.cValues = updateCValues(params);
    betaC = params.betaC;
    cValues = params.cValues;
    choiceProbs = exp(betaC * cValues) / sum(exp(betaC * cValues));
end
