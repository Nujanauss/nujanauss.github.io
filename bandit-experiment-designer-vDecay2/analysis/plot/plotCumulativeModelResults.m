function plotCumulativeModelResults(numSimulations,settings,results,cumulativeResults,bestPossbileResult)
    models = fieldnames(results);
    numModels = length(fieldnames(results));
    trials = settings.moves;

    figure('Name','Cumulative reward and standard error per model');
    hold on;
    for i = 1:numModels
        model = models{i};
        plot(1:trials, cumulativeResults.(model), 'LineWidth', 1, 'DisplayName', model);
    end
    plot(1:trials, cumsum(bestPossbileResult,1), 'LineWidth', 1, 'DisplayName', 'Best possible');

    xlabel('Trial number');
    ylabel('Cumulative reward');
    title(sprintf('Average reward across a number of models (%d runs)', numSimulations));
    
    legend show;legend boxoff;grid on;box off;hold off;
end