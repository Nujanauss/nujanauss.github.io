function plotConfusionMatrix(trueLabels, predLabels, classLabels)
    % Compute confusion matrix
    confMat = confusionmat(trueLabels, predLabels);

    % Normalize confusion matrix to show percentages (optional)
    confMatNorm = confMat ./ sum(confMat, 2);

    % Plot the confusion matrix
    figure;
    imagesc(confMatNorm);  % Use confMat for raw counts instead of confMatNorm for percentages
    colormap('hot');       % Choose a colormap (hot, cool, gray, etc.)
    colorbar;

    % Add labels and title
    title('Confusion Matrix');
    xlabel('Predicted Class');
    ylabel('True Class');

    % Set class labels on axes
    numClasses = numel(classLabels);
    set(gca, 'XTick', 1:numClasses, 'XTickLabel', classLabels);
    set(gca, 'YTick', 1:numClasses, 'YTickLabel', classLabels);

    % Add numeric text inside each cell (percentages or counts)
    textStrings = num2str(confMatNorm(:), '%0.2f');  % Or '%d' for integer counts
    textStrings = strtrim(cellstr(textStrings));  % Convert to a cell array of strings

    [x, y] = meshgrid(1:numClasses, 1:numClasses);  % Generate coordinates for text placement
    text(x(:), y(:), textStrings(:), 'HorizontalAlignment', 'center', 'Color', 'black');

    % Ensure axis proportions are square
    axis square;
end
