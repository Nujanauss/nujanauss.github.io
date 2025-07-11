function params = kalmanUpdate(params)
    reward = params.previousReward(end);
    chosen = params.previousSelection(end);

    means = params.means;
    variances = params.variances;
    variance_o = params.variance_o;
    variance_d = params.variance_d;
    lamda = params.lamda;
    theta = params.theta;

    poissonIndex = params.poissonIndex;
    expectedOccurance = params.expectedOccurance;

    delta = reward - means(chosen);
    k = variances(chosen) / (variances(chosen) + variance_o);

    variances(chosen) = (1 - k) * variances(chosen);
    means(chosen) = means(chosen) + k * delta;

    params.means = lamda * means + (1 - lamda) * theta;
    params.variances = lamda^2 * variances + variance_d;



        if rand() < poisspdf(poissonIndex, expectedOccurance) % Poisson probability check
            meanValues(bandit) = 0.8 - (rand() * 0.2); % Jump up to new heights
        else
            meanValues(bandit) = min(1, max(0.01, lambda * currentMean)); % Otherwise, usually, decay with constraints
        end
        newValue = min(1, max(0.01, normrnd(meanValues(bandit), stdDev))); % Apply Gaussian randomness
end
