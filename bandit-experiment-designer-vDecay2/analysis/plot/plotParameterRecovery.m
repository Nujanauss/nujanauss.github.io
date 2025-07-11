function plotParameterRecovery(modelName,modelParams,obj2FittedParams,numSamples)
    % Get color from distance based on first sample
    distances = zeros(numSamples,1);
    for i = 1:numSamples
        sample = obj2FittedParams(i);
        p1 = modelParams{1};
        distances(i) = abs(sample.objParams.(p1) - sample.fittedParams.(p1));
    end

    meanDist = mean(distances);
    stdDist = std(distances);

    figure('name',['Parameter recovery for ', modelName],'units','normalized','outerposition',[0 0 1 1])
    for i = 1:length(modelParams)
        subplot(2,2,i);
        hold on;
        paramName = modelParams{i};

        x = arrayfun(@(x) x.objParams.(paramName), obj2FittedParams, 'UniformOutput', false);
        x = [x{:}];
        y = arrayfun(@(m) m.fittedParams.(paramName), obj2FittedParams, 'UniformOutput', false);
        y = [y{:}];
        
        p = polyfit(x,y,1);
        yfit = polyval(p, x);

        residuals = y - yfit;
        n = length(y); % Number of data points
        dof = n - 2; % Degrees of freedom (n - 2 for linear fit)
        SE = sqrt(sum(residuals.^2) / dof);

        % Calculate the prediction intervals
        t = tinv(0.975, dof);
        xfit = linspace(min(x), max(x), 100);
        yfit = polyval(p, xfit);
    
        % Calculate the confidence intervals
        SE_yfit = SE * sqrt(1/n + (xfit - mean(x)).^2 / sum((x - mean(x)).^2)); % Error in yfit
        yfit_upper = yfit + t * SE_yfit;
        yfit_lower = yfit - t * SE_yfit;
    
        fill([xfit, fliplr(xfit)], [yfit_upper, fliplr(yfit_lower)], ...
        [0.9, 0.9, 0.9], 'EdgeColor', 'none'); % Gray shaded region

        for j = 1:numSamples
            pointColor = getColor(distances(j),meanDist,stdDist);
            plot(obj2FittedParams(j).objParams.(paramName), obj2FittedParams(j).fittedParams.(paramName), 'o', ...
         'MarkerSize', 4, 'LineWidth', 1, 'MarkerFaceColor', pointColor, 'MarkerEdgeColor', pointColor);
        end

        xlabel(['Simulated ', paramName]);
        ylabel(['Fitted ', paramName]);
        title(['Simulated vs fitted ', paramName]);
        
        plot(x, polyval(p, x), ':b', 'LineWidth', 0.9);        
        xRange = linspace(min(min(xlim(gca))), max(max(xlim(gca)), max(ylim(gca))), 100);
        plot(xRange, xRange, '--k', 'LineWidth', 1); % plot x=y dashed line
    end
    sgtitle(['Parameter recovery for the ', modelName, ' choice rule'])
    hold off;
end

function color = getColor(distance,meanDist,stdDist)
    cmap = [0 0 1; 0 0 0; 1 0 0];
    if distance <= meanDist + stdDist
        color = cmap(1,:);
    elseif distance <= meanDist + 2 * stdDist
        color = cmap(2,:);
    else
        color = cmap(3,:);
    end
end
