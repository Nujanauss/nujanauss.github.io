function optimisationResults = optimiseEachAlgorithmOverSelections(algorithms,rewardsArray,trueSelections,iterations)
    optimisationResults = struct();
    for i = 1:length(algorithms)
        algo = algorithms{i};
        
        [LL, fittedParams] = bruteOptimise(algo, rewardsArray, trueSelections, iterations);
        
        optimisationResults.(algo).LL = LL;
        optimisationResults.(algo).fittedParams = fittedParams;
    end
end