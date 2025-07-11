function [choiceProbs,params] = directedSoftmaxChoiceRule(params)
    params = kalmanUpdate(params);

    beta = params.beta;
    omega = params.omega;
    means = params.means;
    variances = params.variances;

    e = exp(beta * (means + omega * sqrt(variances)));
    choiceProbs = e / sum(e);
end
