function results = simulateAgentsRunningTrajectory(settings,trajectory,numSimulations)
    kalmanParams = {'means',zeros(4,1),'variances',zeros(4,1),'variance_o',4.0^2,'variance_d',settings.stdDev,'lamda',settings.decay,'theta',0};
    socialParams = {'comparisonFrequency',settings.comparisonFrequency,'upwardComparisonPercentage',settings.probUpwardComparison}; %REAL EXPERIMENT: probUpward + gaussianRandom(0, 0.02)
    
    results = struct();
    for i = 1:numSimulations
        [~,results.random(i).selections, ~, results.random(i).rewards] = ...
            simulateData(trajectory, @randomChoiceRule);
    
        [~,results.randomBias(i).selections, ~, results.randomBias(i).rewards] = ...
            simulateData(trajectory, @randomBiasedChoiceRule, 'bias', 0.99, 'biasedArm', 1);
    
        [~,results.winStay(i).selections, ~, results.winStay(i).rewards] = ...
            simulateData(trajectory, @winStayLoseSwitchChoiceRule, 'epsilon', 0.2, 'repeatThreshold', 0.55);
    
        [~,results.perseveration(i).selections, ~, results.perseveration(i).rewards] = ...
            simulateData(trajectory, @perseverationChoiceRule, 'betaC', 10, 'alphaC', 0.9, 'cValues', [0;0;0;0]);
    
        [~,results.greedy(i).selections, ~, results.greedy(i).rewards] = ...
            simulateData(trajectory, @epsilonGreedyChoiceRule, 'epsilon', 0.2, kalmanParams{:});
    
        [~,results.softmax(i).selections, ~, results.softmax(i).rewards] = ...
            simulateData(trajectory, @softmaxChoiceRule, 'beta', 10, kalmanParams{:});
    
        [~,results.directedSoftmax(i).selections, ~, results.directedSoftmax(i).rewards] = ...
            simulateData(trajectory, @directedSoftmaxChoiceRule, 'beta', 10, 'omega', 0.2, kalmanParams{:});
    
        [~,results.socialWinStay(i).selections, results.socialWinStay(i).comparisons, results.socialWinStay(i).rewards] = ...
            simulateData(trajectory, @socialWinStayLoseSwitchChoiceRule, 'epsilon', 0.2, 'repeatThreshold', 0.55, 'tau', 0.5, socialParams{:});
    end
end
