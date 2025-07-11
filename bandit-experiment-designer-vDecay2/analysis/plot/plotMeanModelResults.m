function plotMeanModelResults(numSimulations,settings,results)
    models = fieldnames(results);
    numModels = length(fieldnames(results));
    trials = settings.moves;

    figure('Name','Average reward and standard error per model');
    hold on;
    for i = 1:numModels
        model = models{i};
        modelRewards = zeros(trials,numSimulations);
        for k = 1:numSimulations
            modelRewards(:,k) = results.(model)(k).rewards;
        end
        meanRewards = mean(modelRewards, 2);
        plot(1:trials, meanRewards, 'LineWidth', 1, 'DisplayName', model);
        stdError = std(modelRewards, 0, 2) / sqrt(numSimulations);
        %fill([1:trials, fliplr(1:trials)], [meanRewards' - stdError', fliplr(meanRewards' + stdError')], 'k', 'FaceAlpha', 0.2, 'EdgeColor', 'none');
    end

    xlabel('Trial number');
    ylabel('Average reward');
    title(sprintf('Average reward across a number of models (%d runs)', numSimulations));
    
    legend show;legend boxoff;grid on;box off;hold off;
end