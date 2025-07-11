function [choiceProbs,params] = randomBiasedChoiceRule(params)
    bias = params.bias;
    biasedArm = params.biasedArm;
    choiceProbs = ones(4, 1);
    choiceProbs(biasedArm) = bias;
    choiceProbs(setdiff(1:end,biasedArm)) = (1 - bias) / 3;
end