function cumulativeResults = getCumulativeResults(settings,results,numSimulations)
    models = fieldnames(results);
    numModels = length(fieldnames(results));
    trials = settings.moves;
    cumulativeResults = struct();
    for i = 1:numModels
        model = models{i};
        modelRewards = zeros(trials,numSimulations);
        for k = 1:numSimulations
            modelRewards(:,k) = results.(model)(k).rewards;
        end
        cumulativeResults.(model) = mean(cumsum(modelRewards, 1), 2);
    end
end